# OTIMIZAÇÃO 0.2 — React + Kotlin

Projeto inicial para continuar o protótipo pelo celular ou computador.

## O que está incluído
- Interface React com tema preto/vermelho e senha de entrada `wwz`.
- Lista local de jogos (adicionar/remover nomes).
- Ponte JavaScript ↔ Kotlin via Android WebView.
- Consulta das taxas de atualização disponíveis.
- Solicitação de taxa preferida **somente para a janela deste app**.
- Atalhos para configurações de tela e opções de desenvolvedor.
- Avisos honestos para recursos que o Android comum não permite alterar.

## Limitações importantes
- A taxa solicitada vale para a janela do OTIMIZAÇÃO 0.2. O Android/fabricante pode ignorar ou limitar a solicitação; isso não força a taxa global do aparelho.
- Um app comum não pode alterar diretamente as escalas globais de animação nem trocar o driver gráfico. O app abre as configurações correspondentes quando disponíveis e explica a limitação.
- A senha `wwz` é apenas uma trava visual local, não uma autenticação segura.
- O projeto é um ponto de partida; não foi compilado nem testado em um aparelho nesta entrega.

## Estrutura
- `frontend/`: código React + Vite.
- `android/`: projeto Android nativo Kotlin com WebView.
- `scripts/copy-web-assets.sh`: copia o build React para os assets Android.

## Como preparar
1. Instale Node.js e Android Studio em um computador, ou use um ambiente de desenvolvimento online que aceite projetos Node/Gradle.
2. Na pasta `frontend`, execute `npm install` e `npm run build`.
3. Copie o conteúdo de `frontend/dist/` para `android/app/src/main/assets/` (o script `scripts/copy-web-assets.sh` faz isso em ambiente Linux/macOS).
4. Abra a pasta `android/` no Android Studio e compile o APK.

No Android Studio, a pasta aberta deve ser `android/`, não a pasta raiz.

## Pelo celular
Você pode guardar o ZIP no celular e enviar ao GitHub pelo navegador. Para compilar APK, será necessário um serviço/ambiente que compile Android/Gradle; GitHub sozinho guarda o código, não gera APK automaticamente.
