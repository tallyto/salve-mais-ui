import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Anexo, UrlDownload } from '../models/anexo.model';

@Injectable({
  providedIn: 'root'
})
export class AnexoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Faz upload de um comprovante para uma conta fixa
   * @param contaFixaId ID da conta fixa
   * @param arquivo Arquivo para upload
   */
  uploadComprovante(contaFixaId: number, arquivo: File): Observable<Anexo> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    return this.http.post<Anexo>(`${this.apiUrl}/contas-fixas/${contaFixaId}/comprovantes`, formData);
  }

  /**
   * Lista todos os comprovantes de uma conta fixa
   * @param contaFixaId ID da conta fixa
   */
  listarComprovantes(contaFixaId: number): Observable<Anexo[]> {
    return this.http.get<Anexo[]>(`${this.apiUrl}/contas-fixas/${contaFixaId}/comprovantes`);
  }

  /**
   * Lista todos os comprovantes do sistema
   */
  listarTodosComprovantes(): Observable<Anexo[]> {
    return this.http.get<Anexo[]>(`${this.apiUrl}/comprovantes`);
  }

  /**
   * Obtém URL para download do comprovante
   * @param contaFixaId ID da conta fixa
   * @param anexoId ID do anexo
   */
  obterUrlDownload(contaFixaId: number, anexoId: number): Observable<UrlDownload> {
    return this.http.get<UrlDownload>(`${this.apiUrl}/contas-fixas/${contaFixaId}/comprovantes/${anexoId}/download`);
  }

  /**
   * Obtém URL para download do comprovante (sem contexto de conta fixa)
   * @param anexoId ID do anexo
   */
  obterUrlDownloadGlobal(anexoId: number): Observable<UrlDownload> {
    return this.http.get<UrlDownload>(`${this.apiUrl}/comprovantes/${anexoId}/download`);
  }

  /**
   * Remove um comprovante
   * @param contaFixaId ID da conta fixa
   * @param anexoId ID do anexo
   */
  removerComprovante(contaFixaId: number, anexoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/contas-fixas/${contaFixaId}/comprovantes/${anexoId}`);
  }

  /**
   * Remove um comprovante (sem contexto de conta fixa)
   * @param anexoId ID do anexo
   */
  removerComprovanteGlobal(anexoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comprovantes/${anexoId}`);
  }
}
