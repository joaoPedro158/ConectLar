package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Enum.CategoriaEnum;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Model.dto.TrabalhoRecord;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TrabalhoService {

    List<TrabalhoDTO> getAll();
    TrabalhoDTO findById(Long id);
    TrabalhoDTO save(TrabalhoRecord record, List<MultipartFile> arquivos, Long idUsuario);
    TrabalhoDTO update(Long id, TrabalhoRecord trabalho, List<MultipartFile> arquivo);
    void delete(Long id);
    void solicitarTrabalho(Long idTrabalho, Long  idProfissional);
    void processarResposta(Long idTrabalho, boolean resposta);
    void cancelarTrabalho(Long idTrabalho, Long  idUsuario);
    void concluirTrabalho(Long idTrabalho, Long idUsuario);
    List<TrabalhoDTO> BuscarProblema(String problema);
    List<TrabalhoDTO> filtroCategoria(CategoriaEnum categoria);


}
