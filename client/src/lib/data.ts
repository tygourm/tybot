import { z } from "zod";

import { safeParseJSON } from "@/lib/utils";

const BaseSchema = z.object({
  id: z.uuid(),
  type: z.string(),
});

const FileInfoSchema = BaseSchema.extend({
  type: z.literal("FileInfo"),
  bucketName: z.string(),
  objectName: z.string(),
  contentType: z.string().optional().nullable(),
});

const GeoPointSchema = BaseSchema.extend({
  type: z.literal("GeoPoint"),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  alt: z.number().min(0).optional().nullable(),
  label: z.string().optional().nullable(),
});

const CatalogObjectSchema = z.discriminatedUnion("type", [
  FileInfoSchema,
  GeoPointSchema,
]);

type FileInfo = z.infer<typeof FileInfoSchema>;
type GeoPoint = z.infer<typeof GeoPointSchema>;
type CatalogObject = z.infer<typeof CatalogObjectSchema>;

const inferCatalogObjects = (value: string) => {
  const parsed = safeParseJSON(value);
  if (!parsed || !Array.isArray(parsed) || parsed.length === 0)
    return undefined;
  return parsed
    .map((o) => {
      // TODO Handle other data types
      if (typeof o.lat === "number" && typeof o.lon === "number") {
        const result = GeoPointSchema.safeParse({
          id: crypto.randomUUID(),
          type: "GeoPoint",
          ...o,
        });
        return result.data;
      }
    })
    .filter(Boolean) as CatalogObject[];
};

export {
  type CatalogObject,
  CatalogObjectSchema,
  type FileInfo,
  FileInfoSchema,
  type GeoPoint,
  GeoPointSchema,
  inferCatalogObjects,
};
