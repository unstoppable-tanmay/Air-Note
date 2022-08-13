import { Function } from "@serverless-stack/resources";

export function Sendemail({ stack, app }) {
  new Function(stack, "email", {
    handler: "../services/functions/sendemail.handler",
  });
}