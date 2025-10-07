# Organização dos PDFs dos Cursos Online

## Estrutura de Pastas Criada

```
assets/cursos/
├── dbf-online/
│   ├── aula1.pdf
│   ├── aula2.pdf
│   ├── aula3.pdf
│   ├── aula4.pdf
│   ├── aula5.pdf
│   ├── aula6.pdf
│   ├── aula7.pdf
│   ├── aula8.pdf
│   ├── aula9.pdf
│   ├── aula10.pdf
│   ├── aula11.pdf
│   └── aula12.pdf
├── oque-biblia-diz/
│   ├── aula1.pdf
│   ├── aula2.pdf
│   ├── aula3.pdf
│   ├── aula4.pdf
│   ├── aula5.pdf
│   ├── aula6.pdf
│   ├── aula7.pdf
│   └── aula8.pdf
└── revelacoes/
    ├── aula1.pdf
    ├── aula2.pdf
    ├── aula3.pdf
    ├── aula4.pdf
    ├── aula5.pdf
    ├── aula6.pdf
    ├── aula7.pdf
    ├── aula8.pdf
    ├── aula9.pdf
    └── aula10.pdf
```

## Como Organizar os PDFs

### 1. DBF - Deixe a Bíblia Falar (Online)
- **Pasta**: `assets/cursos/dbf-online/`
- **Arquivos**: aula1.pdf até aula12.pdf
- **Descrição**: Versão online do curso presencial DBF

### 2. O que a Bíblia diz
- **Pasta**: `assets/cursos/oque-biblia-diz/`
- **Arquivos**: aula1.pdf até aula8.pdf
- **Descrição**: Estudo temático sobre doutrinas bíblicas

### 3. Revelações de Cristo
- **Pasta**: `assets/cursos/revelacoes/`
- **Arquivos**: aula1.pdf até aula10.pdf
- **Descrição**: Estudo avançado sobre revelações de Jesus

## Instruções para Upload

1. **Nomeação dos Arquivos**:
   - Use sempre o formato: `aulaX.pdf` (onde X é o número da aula)
   - Exemplo: `aula1.pdf`, `aula2.pdf`, etc.

2. **Tamanho dos Arquivos**:
   - Recomendo PDFs otimizados (máximo 5MB por arquivo)
   - Use ferramentas online para comprimir se necessário

3. **Ordem das Aulas**:
   - Os arquivos devem estar numerados sequencialmente
   - O sistema libera as aulas em ordem (aula 2 só após completar aula 1)

## Configuração dos Formulários Google

Após organizar os PDFs, você precisará:

1. **Criar formulários Google Forms** para cada aula
2. **Atualizar as URLs** no arquivo `cursos-online.js`
3. **Testar o sistema** com algumas aulas

### Localização das URLs no código:
```javascript
// No arquivo cursos-online.js, procure por:
formularioUrl: 'https://forms.gle/EXEMPLO1'
// E substitua pelos links reais dos seus formulários
```

## Vantagens do Armazenamento Local

✅ **Controle Total**: Você gerencia todos os arquivos  
✅ **Sem Dependências**: Não depende de serviços externos  
✅ **Carregamento Rápido**: Arquivos servidos diretamente do seu servidor  
✅ **Sem Limites**: Não há restrições de banda ou downloads  
✅ **Gratuito**: Sem custos adicionais  

## Próximos Passos

1. Organize os PDFs nas pastas conforme mostrado acima
2. Crie os formulários Google para cada aula
3. Atualize as URLs dos formulários no `cursos-online.js`
4. Teste o sistema completo
5. Publique as alterações

## Observações Importantes

- **Backup**: Mantenha sempre backup dos PDFs originais
- **Versioning**: Se atualizar um PDF, mantenha o mesmo nome do arquivo
- **Teste**: Teste cada curso completamente antes de liberar aos usuários
- **Monitoramento**: Acompanhe o progresso dos usuários através do localStorage

---

**Sistema Desenvolvido para Igreja de Cristo do Centro**  
*Cursos Bíblicos Online Gratuitos*