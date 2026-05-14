import dotenv from "dotenv";
import path from "path";

const envFiles = ["users.env", ".env"];

for (const file of envFiles) {
  const result = dotenv.config({
    path: path.resolve(process.cwd(), file),
    override: false,
    quiet: true,
  });

  if (!result.error) {
    break;
  }
}
