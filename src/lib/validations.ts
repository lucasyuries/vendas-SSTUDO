// ============================================================================
// Schemas Zod — validação de inputs (cliente + servidor)
// ============================================================================

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido").max(255),
  password: z.string().min(1, "Informe sua senha").max(72),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Os esquemas de captação de lead (orçamento e dúvida) vivem em @/lib/leads,
// junto com a normalização de telefone e a montagem das linhas gravadas, que
// são o ponto de costura testado do projeto.
