package br.ifrn.conectlar.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class SalvaArquivoImpService implements SalvaArquivoService {

    private final String UPLOAD_DIR = "upload/";

    @Override
    public String salvaImagem(MultipartFile arquivo) throws IOException {

        File diretorio = new File(UPLOAD_DIR);
        if (!diretorio.exists()) {
            boolean criou =diretorio.mkdirs();
            if (!criou) {
                throw new IOException("Falha ao criar diretório: " + UPLOAD_DIR);
            }
        }

        String nomeOriginal = arquivo.getOriginalFilename();
        String nomeUnico = UUID.randomUUID().toString() + "_" + nomeOriginal;

        Path caminhoDestino = Paths.get(UPLOAD_DIR + nomeUnico);
        Files.copy(arquivo.getInputStream(), caminhoDestino, StandardCopyOption.REPLACE_EXISTING);


        return nomeUnico;
    }
}
