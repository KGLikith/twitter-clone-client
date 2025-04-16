import z from "zod";
export const formSchema = z.object({
  userName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  profileImageUrl: z.string().optional(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email(),
  location: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  notificationPreference: z.object({
    likes: z.boolean(),
    comments: z.boolean(),
    follows: z.boolean(),
  }),
});
