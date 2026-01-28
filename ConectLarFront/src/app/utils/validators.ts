
 //@param cnpj - CNPJ com ou sem máscara
 //@returns true se o CNPJ é válido, false caso contrário

export function validarCNPJ(cnpj: string): boolean {
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');


  if (cnpjLimpo.length !== 14) {
    return false;
  }

  if (/^(\d)\1+$/.test(cnpjLimpo)) {
    return false;
  }

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

export function formatarTelefone(valor: string) {
  const d = (valor ?? "").replace(/\D/g, "").slice(0, 11);

  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

  //@param cnpj - CNPJ sem máscara
  //@returns

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
