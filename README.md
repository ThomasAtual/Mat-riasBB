# Minha Trilha de Estudos

Página estática para acompanhar as aulas listadas no arquivo `GRAN.zip`. O catálogo usa a matéria (pasta) e o nome de cada PDF. Os PDFs não estão incluídos: este site é um organizador de estudos leve, e cada linha representa uma aula/arquivo do pacote.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie todos os arquivos desta pasta para a raiz do repositório.
2. Abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**, selecione `main` e `/ (root)`, e salve.
4. Acesse o endereço publicado. No iPhone, abra pelo Safari, toque em **Compartilhar → Adicionar à Tela de Início**.

## Uso e dados

Escolha uma matéria para abrir a lista de aulas. Use a caixa de busca para filtrar os assuntos, marque a caixa ao concluir e escreva um comentário curto abaixo do título. Progresso e comentários ficam salvos no `localStorage` do navegador e aparelho em uso; não há conta nem sincronização entre aparelhos. Evite limpar os dados do site se quiser preservar o progresso.

Para atualizar a lista, edite `materias.json`, mantendo a estrutura de matérias e aulas.
