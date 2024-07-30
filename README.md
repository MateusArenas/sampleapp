# Estrutura dos Apps

- Os arquivos do projeto devem ser **TypeScript** e não JavaScript.

- No arquivo `app.json`, deve-se remover a configuração da imagem da splash screen e deixar somente a propriedade `backgroundColor` na seção splash.

- Deve haver uma pasta chamada `components` que conterá:
  - Componentes do projeto.
  - Os componentes devem permitir algum nível de customização ao serem utilizados em uma tela.

- Deve haver uma pasta chamada `hooks` que:
  - Contém hooks, cada um começando com `use`.
  - Hooks devem ser criados conforme necessário para evitar a repetição de código.

- Deve haver um arquivo chamado `types.tsx` que:
  - Contém todas as tipagens globais.
  - Inclui as tipagens dos parâmetros das telas.

- Deve haver uma pasta chamada `screens` que conterá:
  - Todas as telas do projeto.
  - Os arquivos de tela devem seguir a nomenclatura `NomeDaTelaScreen.tsx`.

- Deve conter uma tela de permissões dos recursos do app chamada `PermissionsScreen.tsx`.

- Deve conter uma Splash Screen, implementada no arquivo `SplashScreen.tsx`, que incluirá:
  - Pré-carregamento dos assets, incluindo fontes e ícones.
  - Inscrição no sistema de notificações, se disponível no projeto.
  - Verificação da versão do build e, se necessário, atualização do app.
  - Carregamento dos recursos de contextos que precisam ser inicializados no início.

- Deve conter uma tela de atualização de versão chamada `ForceUpdateScreen.tsx`, que deve estar disponível em ambas as stacks de rotas.

- Deve haver uma pasta chamada `navigation` que conterá:
  - As configurações de navegação.
  - Um arquivo de configuração de `Linking` já configurado com todos os caminhos das telas.
  - Stack de Rotas Pós-Autenticação: Deve ser configurada em `AppNavigator.tsx`.
  - Stack de Rotas Não Autenticadas e de Autenticação: Deve ser configurada em `AuthNavigator.tsx`.

- Deve haver uma pasta chamada `context` que conterá:
  - Códigos que fornecem contexto global para o projeto.
  - Um contexto de autenticação em `context/auth.tsx`, responsável por gerenciar o estado compartilhado, incluindo token de acesso, objeto de usuário e situação de logado/deslogado para troca das stacks de rotas.

- Deve haver suporte a temas escuro e claro, gerenciado em um contexto chamado `context/theme.tsx`. Esse contexto deve:
  - Compartilhar um estado `colorScheme`, que pode ser `light` ou `dark`.
  - Fornecer métodos para alternar entre os esquemas de cores.

- Deve haver um contexto chamado `context/pushNotification.tsx` que gerencia as notificações, incluindo:
  - Armazenamento do token de notificação.
  - Recebimento e processamento das notificações.
  - Criação e compartilhamento dos métodos para interação com as notificações.
  - Exibição interna das notificações usando um componente dedicado e abertura das notificações com linking.

- Deve haver uma pasta chamada `handlers` que conterá:
  - Componentes de nível único, como Alert, SpinnerOverlay, ActionSheet, etc.

- Deve haver uma pasta chamada `services` que conterá:
  - APIs do projeto.
  - Conexão com Async Storage, criptografia, etc.
  - Uma instância do Bugsnag já configurada em `services/bugsnag.ts`.
  - Um arquivo `api.ts` com a instância configurada e a URL base da API.
  - Um arquivo `apiHandler.ts` com funções para as rotas da API e tratamento de erros, incluindo o envio de erros para o Bugsnag.

- Deve haver uma pasta chamada `helpers` que incluirá:
  - Funções auxiliares específicas, manipuladores e processadores, podendo estar ligadas a operações de domínio ou lógica de aplicação.

- Deve haver uma pasta chamada `utils` que incluirá:
  - Funções genéricas e funções de assistência geral que tendem a ser mais independentes do contexto específico do projeto.

- Deve haver uma pasta chamada `assets` que conterá:
  - Imagens em `assets/images`.
  - Fontes em `assets/fonts`.
