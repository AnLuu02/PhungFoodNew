import { NextRequest, NextResponse } from 'next/server';
import { generateReportPDF } from '~/lib/func-handler/generateReportPDF';
import { api } from '~/trpc/server';

export async function POST(req: NextRequest) {
  try {
    const { period } = await req.json();
    const reportData = await api.Revenue.getOverviewDetail({
      startTime: new Date().getTime() - period * 24 * 60 * 60 * 1000,
      endTime: new Date().getTime()
    });
    const pdfBuffer = await generateReportPDF(reportData);

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=bao-cao-' + (period ? period + '-ngay' : 'hom-nay') + '.pdf'
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Xuất PDF thất bại' }, { status: 500 });
  }
}
