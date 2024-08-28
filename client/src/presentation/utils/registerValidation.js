import { z } from "zod";

const registerValidationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3).max(50),
  password: z.string().min(8),
});

export default registerValidationSchema;
