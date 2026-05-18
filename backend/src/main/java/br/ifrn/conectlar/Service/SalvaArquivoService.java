package br.ifrn.conectlar.Service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


public interface SalvaArquivoService {

    String salvaImagem(MultipartFile arquivo) throws IOException;
}
