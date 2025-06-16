import { z } from "zod";

// Función para validar RUT chileno
function validarRut(rut: string): boolean {
  // Limpiar RUT
  const rutLimpio = rut.replace(/[.-]/g, '');
  
  // Validar formato
  if (!/^\d{7,8}[0-9kK]$/.test(rutLimpio)) {
    return false;
  }
  
  // Separar número y dígito verificador
  const numero = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();
  
  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const dvCalculado = 11 - (suma % 11);
  const dvFinal = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'K' : dvCalculado.toString();
  
  return dv === dvFinal;
}

// Schema para crear/editar cliente
export const clientSchema = z.object({
  // Identificación
  tax_id: z.string()
    .min(1, "RUT es requerido")
    .refine(validarRut, "RUT inválido"),
  
  legal_name: z.string()
    .min(1, "Razón social es requerida")
    .max(255, "Razón social muy larga"),
  
  trade_name: z.string()
    .max(255, "Nombre fantasía muy largo")
    .optional()
    .nullable(),
  
  // Contacto
  email: z.string()
    .email("Email inválido")
    .optional()
    .nullable()
    .or(z.literal("")),
  
  phone: z.string()
    .regex(/^(\+?56)?[\s]?[2-9]\d{8}$/, "Formato de teléfono inválido")
    .optional()
    .nullable()
    .or(z.literal("")),
  
  website: z.string()
    .url("URL inválida")
    .optional()
    .nullable()
    .or(z.literal("")),
  
  // Dirección
  address: z.string()
    .max(500, "Dirección muy larga")
    .optional()
    .nullable(),
  
  city: z.string()
    .max(100, "Ciudad muy larga")
    .optional()
    .nullable(),
  
  state: z.string()
    .max(100, "Región muy larga")
    .optional()
    .nullable(),
  
  postal_code: z.string()
    .max(20, "Código postal muy largo")
    .optional()
    .nullable(),
  
  district_id: z.number()
    .optional()
    .nullable(),
  
  // Información comercial
  business_activity: z.string()
    .max(500, "Actividad muy larga")
    .optional()
    .nullable(),
  
  activity_code: z.string()
    .max(20, "Código muy largo")
    .optional()
    .nullable(),
  
  business_start_date: z.string()
    .datetime()
    .optional()
    .nullable()
    .or(z.literal("")),
  
  business_end_date: z.string()
    .datetime()
    .optional()
    .nullable()
    .or(z.literal("")),
  
  // Representante legal
  legal_representative: z.string()
    .max(255, "Nombre muy largo")
    .optional()
    .nullable(),
  
  legal_rep_tax_id: z.string()
    .refine((val) => !val || validarRut(val), "RUT del representante inválido")
    .optional()
    .nullable(),
  
  // Configuración
  client_type: z.enum(["company", "individual"])
    .default("company"),
  
  is_vat_contributor: z.boolean()
    .default(true),
  
  notes: z.string()
    .optional()
    .nullable()
});

// Tipo inferido del schema
export type ClientFormData = z.infer<typeof clientSchema>;

// Schema para búsqueda/filtros
export const clientFilterSchema = z.object({
  searchTerm: z.string().optional(),
  city: z.string().optional(),
  activity: z.string().optional(),
  page: z.number().min(1).optional(),
  perPage: z.number().min(1).max(100).optional()
});

export type ClientFilterData = z.infer<typeof clientFilterSchema>;

// Schema para importación masiva
export const clientImportSchema = z.object({
  tax_id: z.string().min(1, "RUT es requerido"),
  legal_name: z.string().min(1, "Razón social es requerida"),
  trade_name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  business_activity: z.string().optional(),
  legal_representative: z.string().optional()
});

export type ClientImportData = z.infer<typeof clientImportSchema>;
