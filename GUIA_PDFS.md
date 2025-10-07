# 📋 Guia de Organização de PDFs - Igreja de Cristo do Centro

## 📁 Estrutura de Pastas

```
assets/pdfs/
├── dbf/                    # Curso DBF (Deixe a Bíblia Falar)
│   ├── licao-01.pdf       # Introdução à Bíblia
│   ├── licao-02.pdf       # Deus e Sua Natureza
│   ├── licao-03.pdf       # Jesus Cristo - O Filho de Deus
│   ├── licao-04.pdf       # O Espírito Santo
│   ├── licao-05.pdf       # O Homem e o Pecado
│   ├── licao-06.pdf       # A Salvação
│   ├── licao-07.pdf       # A Igreja de Cristo
│   ├── licao-08.pdf       # O Batismo Bíblico
│   ├── licao-09.pdf       # A Ceia do Senhor
│   ├── licao-10.pdf       # A Adoração Verdadeira
│   ├── licao-11.pdf       # A Vida Cristã
│   ├── licao-12.pdf       # A Segunda Vinda de Cristo
│   └── certificado-dbf.pdf
│
├── biblia-diz/             # Curso "O que a Bíblia diz"
│   ├── tema-01-igreja.pdf
│   ├── tema-02-batismo.pdf
│   ├── tema-03-oracao.pdf
│   ├── tema-04-dizimos.pdf
│   ├── tema-05-musica.pdf
│   ├── tema-06-segunda-vinda.pdf
│   └── certificado-biblia-diz.pdf
│
└── outros/                 # Materiais extras
    ├── guia-estudo-biblico.pdf
    ├── como-orar.pdf
    └── historia-igreja.pdf
```

## 🎯 Como Adicionar PDFs

### 1. Preparar os Arquivos PDF
- **Nomeação**: Use nomes descritivos sem espaços
  - ✅ Bom: `licao-01-introducao-biblia.pdf`
  - ❌ Ruim: `Lição 1 - Introdução à Bíblia.pdf`

- **Tamanho**: Mantenha PDFs até 5MB para carregamento rápido
- **Qualidade**: Use resolução adequada para leitura em celular

### 2. Onde Colocar os Arquivos
```bash
# Para lições do DBF
/assets/pdfs/dbf/licao-XX.pdf

# Para temas do "O que a Bíblia diz"
/assets/pdfs/biblia-diz/tema-XX.pdf

# Para materiais extras
/assets/pdfs/outros/material.pdf
```

### 3. Atualizar o Sistema (Automático)
Quando você adicionar PDFs nas pastas, o sistema automaticamente:
- Detecta novos arquivos
- Cria links de download
- Atualiza o banco de dados
- Registra quem baixou cada material

## 📱 Sistema Sem Login (Email + WhatsApp)

### Como Funciona
1. **Usuário acessa** → Página de cursos
2. **Clica em "Inscrever-se"** → Formulário simples aparece
3. **Preenche** → Apenas email e WhatsApp
4. **Confirma** → Recebe acesso aos PDFs
5. **Acompanhamento** → Via WhatsApp

### Formulário de Inscrição
```html
<!-- Exemplo do formulário que será criado -->
<form class="inscription-form">
    <h3>Inscrição Rápida - DBF Online</h3>
    
    <input type="email" placeholder="Seu email" required>
    <input type="tel" placeholder="WhatsApp (92) 99999-9999" required>
    
    <label>
        <input type="checkbox" required>
        Concordo em receber materiais e acompanhamento via WhatsApp
    </label>
    
    <button type="submit">Começar Curso Agora</button>
</form>
```

## 🔄 Fluxo Completo do Sistema

### 1. Inscrição
```
Usuário → Formulário → Email + WhatsApp → Banco de dados → Acesso liberado
```

### 2. Download de PDFs
```
Usuário → Clica no PDF → Sistema registra → Download inicia → WhatsApp notifica professor
```

### 3. Acompanhamento
```
Professor → Vê relatório → WhatsApp estudante → Envia próxima lição
```

## 📊 Relatórios Automáticos

O sistema gera relatórios com:
- ✅ Quem se inscreveu
- ✅ Quais PDFs foram baixados
- ✅ Progresso de cada estudante
- ✅ Dados de contato para follow-up

## 🚀 Próximos Passos

1. **Adicione seus PDFs** nas pastas criadas
2. **Teste o sistema** com uma inscrição
3. **Configure mensagens** automáticas do WhatsApp
4. **Treine a equipe** para usar os relatórios

## 📞 Suporte Técnico

Se precisar de ajuda:
- 📧 Email: suporte@exemplo.com
- 📱 WhatsApp: (92) 99999-9999
- 🌐 Documentação: Este arquivo

---
*Sistema criado para facilitar o acesso aos estudos bíblicos sem barreiras técnicas.*