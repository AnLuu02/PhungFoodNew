import { promises as fs } from 'fs';
import path from 'path';

type TagData = {
  oldTag?: string;
  newTag?: string;
  newName?: string;
};

export const ManageTagVi = async (action: 'upsert' | 'delete' = 'upsert', data: TagData | TagData[]) => {
  const filePath = path.join(process.cwd(), 'src', 'constants', 'tags-vi.json');

  try {
    let tags: Record<string, string> = {};
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      tags = JSON.parse(fileContent);
    } catch (e) {
      tags = {};
    }

    const items = Array.isArray(data) ? data : [data];

    items.forEach(item => {
      if (action === 'upsert') {
        if (item.oldTag && item.oldTag !== item.newTag) {
          delete tags[item.oldTag];
        }
        if (item.newTag && item.newName) {
          tags[item.newTag] = item.newName;
        }
      } else if (action === 'delete') {
        const tagToDelete = item.oldTag || item.newTag;
        if (tagToDelete && tags[tagToDelete]) {
          delete tags[tagToDelete];
        }
      }
    });

    await fs.writeFile(filePath, JSON.stringify(tags, null, 2), 'utf8');
    return { success: true, count: items.length };
  } catch (error) {
    console.error(`[Error] ManageTagVi failed:`, error);
    return { success: false, error };
  }
};

export const SyncFieldFromDb = async (entity: string, fields: string[]) => {
  const filePath = path.join(process.cwd(), 'src', 'constants', 'fields-db.json');

  try {
    let currentFields: Record<string, string[]> = {};

    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      currentFields = JSON.parse(fileContent);
    } catch (e) {
      currentFields = {};
    }

    if (!currentFields[entity]) {
      currentFields[entity] = [];
    }

    currentFields[entity] = Array.from(new Set([...currentFields[entity], ...fields]));

    await fs.writeFile(filePath, JSON.stringify(currentFields, null, 2), 'utf8');

    return { success: true, count: fields.length };
  } catch (error) {
    console.error(`[Error] Sync field from db to json file failed:`, error);
    return { success: false, error };
  }
};
