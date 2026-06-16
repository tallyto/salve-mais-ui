import { Component } from '@angular/core';
import { SALVE_COMMON } from '../../shared/primeng-shared';

@Component({
  selector: 'app-politica-privacidade',
  standalone: true,
  imports: [...SALVE_COMMON],
  template: `
    <div style="min-height:100vh;background:#f8fafc;">
      <nav style="background:#00796b;padding:1rem 2rem;" class="flex align-items-center justify-content-between">
        <div class="flex align-items-center gap-3">
          <i class="pi pi-shield" style="color:#fff;font-size:1.5rem;"></i>
          <span style="color:#fff;font-weight:700;font-size:1.1rem;">Salve Mais</span>
        </div>
        <a routerLink="/" style="color:rgba(255,255,255,0.85);font-size:0.875rem;text-decoration:none;" class="flex align-items-center gap-2">
          <i class="pi pi-arrow-left"></i> Voltar ao início
        </a>
      </nav>

      <div style="max-width:800px;margin:0 auto;padding:3rem 1.5rem;">
        <div class="flex align-items-center gap-3 mb-4">
          <div class="flex align-items-center justify-content-center border-round-full"
               style="width:56px;height:56px;background:rgba(0,121,107,0.1);">
            <i class="pi pi-lock text-primary" style="font-size:1.5rem;"></i>
          </div>
          <div>
            <h1 class="m-0 font-bold" style="font-size:1.75rem;letter-spacing:-0.02em;">Política de Privacidade</h1>
            <span class="text-color-secondary text-sm">Última atualização: junho de 2025</span>
          </div>
        </div>

        <p class="text-color-secondary line-height-3 mb-5">
          A Salve Mais leva a sua privacidade a sério. Esta política descreve como coletamos, usamos e protegemos
          suas informações pessoais quando você utiliza nossa plataforma de gestão financeira.
        </p>

        <p-divider></p-divider>

        <section class="mb-5">
          <h2 class="font-bold mb-3" style="font-size:1.1rem;">1. Dados que coletamos</h2>
          <p class="text-color-secondary line-height-3 mb-3">Coletamos apenas as informações necessárias para o funcionamento do serviço:</p>
          <ul class="text-color-secondary line-height-3 pl-4">
            <li class="mb-2"><strong>Dados de cadastro:</strong> nome, endereço de e-mail e senha (armazenada com hash criptográfico).</li>
            <li class="mb-2"><strong>Dados financeiros:</strong> saldos, transações, despesas e receitas que você registra manualmente na plataforma.</li>
            <li class="mb-2"><strong>Dados de uso:</strong> logs de acesso, endereço IP e informações do navegador para segurança e diagnóstico.</li>
          </ul>
          <p class="text-color-secondary line-height-3 mt-3">
            Não coletamos dados bancários como senhas de banco, tokens de acesso a instituições financeiras ou números de cartão de crédito.
          </p>
        </section>

        <section class="mb-5">
          <h2 class="font-bold mb-3" style="font-size:1.1rem;">2. Como usamos seus dados</h2>
          <ul class="text-color-secondary line-height-3 pl-4">
            <li class="mb-2">Fornecer e melhorar os recursos da plataforma.</li>
            <li class="mb-2">Enviar comunicações relacionadas ao serviço (confirmação de cadastro, alertas de conta).</li>
            <li class="mb-2">Garantir a segurança e prevenir uso fraudulento.</li>
            <li class="mb-2">Cumprir obrigações legais e regulatórias.</li>
          </ul>
        </section>

        <section class="mb-5">
          <h2 class="font-bold mb-3" style="font-size:1.1rem;">3. Compartilhamento de dados</h2>
          <p class="text-color-secondary line-height-3">
            Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais.
            Podemos compartilhar informações apenas nas seguintes situações:
          </p>
          <ul class="text-color-secondary line-height-3 pl-4 mt-3">
            <li class="mb-2"><strong>Prestadores de serviço:</strong> processadores de pagamento e serviços de infraestrutura, sob contrato de confidencialidade.</li>
            <li class="mb-2"><strong>Obrigação legal:</strong> quando exigido por lei, ordem judicial ou autoridade competente.</li>
          </ul>
        </section>

        <section class="mb-5">
          <h2 class="font-bold mb-3" style="font-size:1.1rem;">4. Segurança</h2>
          <p class="text-color-secondary line-height-3">
            Utilizamos criptografia TLS/HTTPS para todas as comunicações, senhas armazenadas com hash seguro (bcrypt)
            e autenticação via JWT com expiração automática. Realizamos backups regulares e monitoramento de segurança
            contínuo. Apesar disso, nenhum sistema é 100% seguro; recomendamos o uso de senhas fortes e exclusivas.
          </p>
        </section>

        <section class="mb-5">
          <h2 class="font-bold mb-3" style="font-size:1.1rem;">5. Seus direitos (LGPD)</h2>
          <p class="text-color-secondary line-height-3 mb-3">
            Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:
          </p>
          <ul class="text-color-secondary line-height-3 pl-4">
            <li class="mb-2">Acessar os dados que temos sobre você.</li>
            <li class="mb-2">Corrigir dados incompletos ou desatualizados.</li>
            <li class="mb-2">Solicitar a exclusão dos seus dados pessoais.</li>
            <li class="mb-2">Revogar o consentimento para uso dos seus dados.</li>
            <li class="mb-2">Portabilidade dos seus dados em formato estruturado.</li>
          </ul>
          <p class="text-color-secondary line-height-3 mt-3">
            Para exercer qualquer desses direitos, entre em contato conosco pelo e-mail abaixo.
          </p>
        </section>

        <section class="mb-5">
          <h2 class="font-bold mb-3" style="font-size:1.1rem;">6. Retenção de dados</h2>
          <p class="text-color-secondary line-height-3">
            Seus dados são mantidos enquanto sua conta estiver ativa. Após o cancelamento, mantemos os dados
            por até 90 dias para fins de auditoria e cumprimento legal, após os quais são permanentemente excluídos.
          </p>
        </section>

        <section class="mb-5">
          <h2 class="font-bold mb-3" style="font-size:1.1rem;">7. Contato</h2>
          <p class="text-color-secondary line-height-3">
            Dúvidas sobre esta política? Entre em contato pelo e-mail
            <a href="mailto:privacidade@salvemais.com.br" class="text-primary">privacidade&#64;salvemais.com.br</a>.
          </p>
        </section>

        <p-divider></p-divider>

        <div class="flex justify-content-between align-items-center mt-4">
          <span class="text-color-secondary text-sm">© {{ currentYear }} Salve Mais. Todos os direitos reservados.</span>
          <a routerLink="/termos-uso" class="text-primary text-sm" style="text-decoration:none;">Termos de Uso</a>
        </div>
      </div>
    </div>
  `
})
export class PoliticaPrivacidadeComponent {
  currentYear = new Date().getFullYear();
}
