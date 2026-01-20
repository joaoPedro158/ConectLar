/**
 * Valida um CNPJ brasileiro
 * @param cnpj - CNPJ com ou sem máscara
 * @returns true se o CNPJ é válido, false caso contrário
 */
export function validarCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');

  // Verifica se tem 14 dígitos
  if (cnpjLimpo.length !== 14) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (ex: 11111111111111)
  if (/^(\d)\1+$/.test(cnpjLimpo)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let tamanho = cnpjLimpo.length - 2;
  let numeros = cnpjLimpo.substring(0, tamanho);
  const digitos = cnpjLimpo.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) {
    return false;
  }

  // Validação do segundo dígito verificador
  tamanho = tamanho + 1;
  numeros = cnpjLimpo.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) {
    return false;
  }

  return true;
}

/**
 * Formata um CNPJ adicionando a máscara
 * @param cnpj - CNPJ sem máscara
 * @returns CNPJ formatado (00.000.000/0000-00)
 */
export function formatarCNPJ(cnpj: string): string {
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  
  if (cnpjLimpo.length <= 2) {
    return cnpjLimpo;
  } else if (cnpjLimpo.length <= 5) {
    return cnpjLimpo.replace(/(\d{2})(\d{0,3})/, '$1.$2');
  } else if (cnpjLimpo.length <= 8) {
    return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
  } else if (cnpjLimpo.length <= 12) {
    return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
  } else {
    return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
  }
}
