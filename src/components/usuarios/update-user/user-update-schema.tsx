import * as z from "zod";
import { userFormSchema } from "../create-user/user-schema";

export const updateUserFormSchema = userFormSchema
  .partial()
  .omit({ clave: true });

export type UpdateUserFormData = z.infer<typeof updateUserFormSchema>;
