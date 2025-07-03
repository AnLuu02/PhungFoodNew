import { promises as fs } from 'fs';
import path from 'path';

export const CreateTagVi = async (data: { old: any; new: any }) => {
  const filePath = path.join(process.cwd(), 'src', 'app', 'lib', 'utils', 'constants', 'tags-vi.ts');
  let content = await fs.readFile(filePath, 'utf8');

  const match = content.match(/const tags: Record<string, string> = ({[\s\S]*?});/);
  let tags: Record<string, string> = {};

  if (match && match[1]) {
    let jsonString = match[1]
      .trim()
      .replace(/'([^']+)'/g, '"$1"')
      .replace(/(\w+(-\w+)*):/g, '"$1":')
      .replace(/,(\s*})/g, '$1');

    if (data.old?.tag !== data.new?.tag) {
      jsonString = jsonString.replace(
        `"${data?.old?.tag}": "${data?.old?.name}"`,
        `"${data?.new?.tag}": "${data?.new?.name}"`
      );
    }

    try {
      tags = JSON.parse(jsonString);
    } catch (error) {
      console.error('Lỗi khi parse tags:', error);
    }
  }

  tags[data?.new?.tag] = data?.new?.name;

  const newContent = `const tags: Record<string, string> = ${JSON.stringify(tags, null, 2)};\n\nexport default tags;`;
  await fs.writeFile(filePath, newContent);
};
