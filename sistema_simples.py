#!/usr/bin/env python3
"""
Sistema de Gestão da Igreja de Cristo do Centro - Versão Simplificada
Sistema sem login para gestão de inscrições em cursos
Requer apenas email e WhatsApp para inscrições
"""

import sqlite3
import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import hashlib
import uuid
from flask import Flask, request, jsonify, send_file, render_template_string
from flask_cors import CORS
import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart

app = Flask(__name__)
CORS(app)

# Configurações
DATABASE_PATH = 'igreja_inscricoes.db'
PDFS_PATH = Path('assets/pdfs')
UPLOAD_FOLDER = 'uploads'

# Configurações de email (configurar com suas credenciais)
EMAIL_CONFIG = {
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587,
    'email': 'seu_email@gmail.com',  # Configure seu email
    'password': 'sua_senha_app',      # Configure sua senha de app
    'from_name': 'Igreja de Cristo do Centro'
}

class IgrejaSistemaSimples:
    def __init__(self):
        self.db_path = DATABASE_PATH
        self.init_database()
        
    def init_database(self):
        """Inicializa o banco de dados com tabelas simplificadas"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Tabela de inscrições (sem login necessário)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS inscricoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL,
                whatsapp TEXT NOT NULL,
                curso TEXT NOT NULL,
                temas_interesse TEXT,  -- JSON para temas específicos
                data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'ativo',
                uuid TEXT UNIQUE,
                ip_address TEXT
            )
        ''')
        
        # Tabela de downloads de PDFs
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS downloads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                inscricao_uuid TEXT,
                arquivo_pdf TEXT NOT NULL,
                data_download DATETIME DEFAULT CURRENT_TIMESTAMP,
                ip_address TEXT,
                FOREIGN KEY (inscricao_uuid) REFERENCES inscricoes (uuid)
            )
        ''')
        
        # Tabela de PDFs disponíveis
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS pdfs_disponiveis (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                curso TEXT NOT NULL,
                nome_arquivo TEXT NOT NULL,
                titulo TEXT NOT NULL,
                descricao TEXT,
                ordem INTEGER DEFAULT 0,
                ativo BOOLEAN DEFAULT 1
            )
        ''')
        
        # Tabela de progresso do estudante
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS progresso (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                inscricao_uuid TEXT,
                licao TEXT NOT NULL,
                completada BOOLEAN DEFAULT 0,
                data_conclusao DATETIME,
                FOREIGN KEY (inscricao_uuid) REFERENCES inscricoes (uuid)
            )
        ''')
        
        conn.commit()
        conn.close()
        
        # Criar pastas necessárias
        PDFS_PATH.mkdir(parents=True, exist_ok=True)
        (PDFS_PATH / 'dbf').mkdir(exist_ok=True)
        (PDFS_PATH / 'biblia-diz').mkdir(exist_ok=True)
        Path(UPLOAD_FOLDER).mkdir(exist_ok=True)
        
        # Inicializar PDFs padrão se não existirem
        self._init_default_pdfs()
    
    def _init_default_pdfs(self):
        """Inicializa lista padrão de PDFs"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Verificar se já existem PDFs cadastrados
        cursor.execute("SELECT COUNT(*) FROM pdfs_disponiveis")
        if cursor.fetchone()[0] == 0:
            # PDFs do curso DBF
            dbf_pdfs = [
                ("dbf", "licao-01.pdf", "Lição 1: Introdução à Bíblia", "Fundamentos sobre a autoridade e inspiração das Escrituras", 1),
                ("dbf", "licao-02.pdf", "Lição 2: Deus e Sua Natureza", "Conhecendo os atributos de Deus através da Bíblia", 2),
                ("dbf", "licao-03.pdf", "Lição 3: Jesus Cristo", "A divindade e humanidade de Jesus", 3),
                ("dbf", "licao-04.pdf", "Lição 4: O Espírito Santo", "O papel do Espírito Santo na vida cristã", 4),
                ("dbf", "licao-05.pdf", "Lição 5: O Homem e o Pecado", "A condição humana e a necessidade de salvação", 5),
                ("dbf", "licao-06.pdf", "Lição 6: A Salvação", "Como somos salvos pela graça através da fé", 6),
                ("dbf", "licao-07.pdf", "Lição 7: A Igreja de Cristo", "A natureza e organização da igreja bíblica", 7),
                ("dbf", "licao-08.pdf", "Lição 8: O Batismo Bíblico", "O significado e importância do batismo", 8),
                ("dbf", "licao-09.pdf", "Lição 9: A Ceia do Senhor", "A ordenança da comunhão cristã", 9),
                ("dbf", "licao-10.pdf", "Lição 10: A Adoração Verdadeira", "Princípios bíblicos de adoração", 10),
                ("dbf", "licao-11.pdf", "Lição 11: A Vida Cristã", "Como viver conforme os ensinamentos de Cristo", 11),
                ("dbf", "licao-12.pdf", "Lição 12: A Segunda Vinda", "A esperança do retorno de Cristo", 12),
            ]
            
            # PDFs do curso "O que a Bíblia diz"
            biblia_diz_pdfs = [
                ("biblia-diz", "tema-01-igreja.pdf", "A Igreja", "O que a Bíblia ensina sobre a igreja", 1),
                ("biblia-diz", "tema-02-batismo.pdf", "O Batismo", "Como e por que ser batizado segundo a Bíblia", 2),
                ("biblia-diz", "tema-03-oracao.pdf", "A Oração", "Princípios bíblicos sobre oração", 3),
                ("biblia-diz", "tema-04-dizimos.pdf", "Dízimos e Ofertas", "O que a Bíblia ensina sobre dar", 4),
                ("biblia-diz", "tema-05-musica.pdf", "Música na Adoração", "A música na adoração do Novo Testamento", 5),
                ("biblia-diz", "tema-06-segunda-vinda.pdf", "A Segunda Vinda", "O que esperar do retorno de Cristo", 6),
            ]
            
            # Inserir PDFs
            for curso, arquivo, titulo, descricao, ordem in dbf_pdfs + biblia_diz_pdfs:
                cursor.execute('''
                    INSERT INTO pdfs_disponiveis (curso, nome_arquivo, titulo, descricao, ordem)
                    VALUES (?, ?, ?, ?, ?)
                ''', (curso, arquivo, titulo, descricao, ordem))
        
        conn.commit()
        conn.close()

# Instância global do sistema
sistema = IgrejaSistemaSimples()

@app.route('/api/inscricoes', methods=['POST'])
def criar_inscricao():
    """Criar nova inscrição sem necessidade de login"""
    try:
        data = request.get_json()
        
        # Validações básicas
        required_fields = ['nome', 'email', 'whatsapp', 'curso']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Gerar UUID único para a inscrição
        inscricao_uuid = str(uuid.uuid4())
        
        # Preparar dados
        nome = data['nome'].strip()
        email = data['email'].strip().lower()
        whatsapp = data['whatsapp'].strip()
        curso = data['curso']
        temas_interesse = json.dumps(data.get('temas', []))
        ip_address = request.remote_addr
        
        # Verificar se email já está inscrito no mesmo curso
        conn = sqlite3.connect(sistema.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id FROM inscricoes 
            WHERE email = ? AND curso = ? AND status = 'ativo'
        ''', (email, curso))
        
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Email já inscrito neste curso'}), 400
        
        # Inserir inscrição
        cursor.execute('''
            INSERT INTO inscricoes (nome, email, whatsapp, curso, temas_interesse, uuid, ip_address)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (nome, email, whatsapp, curso, temas_interesse, inscricao_uuid, ip_address))
        
        conn.commit()
        conn.close()
        
        # Enviar email de boas-vindas (opcional)
        try:
            enviar_email_boas_vindas(nome, email, curso, inscricao_uuid)
        except Exception as e:
            print(f"Erro ao enviar email: {e}")
        
        return jsonify({
            'success': True,
            'message': 'Inscrição realizada com sucesso!',
            'inscricao_uuid': inscricao_uuid
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/pdfs/<curso>')
def listar_pdfs(curso):
    """Listar PDFs disponíveis para um curso"""
    conn = sqlite3.connect(sistema.db_path)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT nome_arquivo, titulo, descricao, ordem
        FROM pdfs_disponiveis
        WHERE curso = ? AND ativo = 1
        ORDER BY ordem
    ''', (curso,))
    
    pdfs = []
    for arquivo, titulo, descricao, ordem in cursor.fetchall():
        pdfs.append({
            'arquivo': arquivo,
            'titulo': titulo,
            'descricao': descricao,
            'ordem': ordem,
            'url': f'/api/download/{curso}/{arquivo}'
        })
    
    conn.close()
    return jsonify(pdfs)

@app.route('/api/download/<curso>/<arquivo>')
def download_pdf(curso, arquivo):
    """Download de PDF com registro"""
    try:
        # Verificar se arquivo existe
        file_path = PDFS_PATH / curso / arquivo
        if not file_path.exists():
            return jsonify({'error': 'Arquivo não encontrado'}), 404
        
        # Registrar download (opcional - pode ser anônimo)
        inscricao_uuid = request.args.get('uuid')
        ip_address = request.remote_addr
        
        conn = sqlite3.connect(sistema.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO downloads (inscricao_uuid, arquivo_pdf, ip_address)
            VALUES (?, ?, ?)
        ''', (inscricao_uuid, arquivo, ip_address))
        conn.commit()
        conn.close()
        
        return send_file(file_path, as_attachment=True)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/inscricoes')
def listar_inscricoes():
    """Listar todas as inscrições (para administração)"""
    conn = sqlite3.connect(sistema.db_path)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT nome, email, whatsapp, curso, data_inscricao, status, uuid
        FROM inscricoes
        ORDER BY data_inscricao DESC
    ''')
    
    inscricoes = []
    for nome, email, whatsapp, curso, data_inscricao, status, uuid_inscricao in cursor.fetchall():
        inscricoes.append({
            'nome': nome,
            'email': email,
            'whatsapp': whatsapp,
            'curso': curso,
            'data_inscricao': data_inscricao,
            'status': status,
            'uuid': uuid_inscricao
        })
    
    conn.close()
    return jsonify(inscricoes)

@app.route('/api/admin/relatorio/<curso>')
def relatorio_curso(curso):
    """Relatório detalhado de um curso"""
    conn = sqlite3.connect(sistema.db_path)
    cursor = conn.cursor()
    
    # Inscrições do curso
    cursor.execute('''
        SELECT COUNT(*) as total,
               COUNT(CASE WHEN status = 'ativo' THEN 1 END) as ativos
        FROM inscricoes
        WHERE curso = ?
    ''', (curso,))
    
    stats = cursor.fetchone()
    
    # Downloads mais populares
    cursor.execute('''
        SELECT d.arquivo_pdf, COUNT(*) as downloads
        FROM downloads d
        JOIN inscricoes i ON d.inscricao_uuid = i.uuid
        WHERE i.curso = ?
        GROUP BY d.arquivo_pdf
        ORDER BY downloads DESC
        LIMIT 10
    ''', (curso,))
    
    downloads = cursor.fetchall()
    
    conn.close()
    return jsonify({
        'curso': curso,
        'total_inscricoes': stats[0] if stats else 0,
        'inscricoes_ativas': stats[1] if stats else 0,
        'downloads_populares': [{'arquivo': arq, 'count': count} for arq, count in downloads]
    })

def enviar_email_boas_vindas(nome, email, curso, inscricao_uuid):
    """Enviar email de boas-vindas com link para PDFs"""
    if not EMAIL_CONFIG['email'] or EMAIL_CONFIG['email'] == 'seu_email@gmail.com':
        return  # Email não configurado
    
    curso_titles = {
        'dbf-presencial': 'DBF - Deixe a Bíblia Falar (Presencial)',
        'dbf-online': 'DBF - Deixe a Bíblia Falar (Online)',
        'biblia-diz': 'O que a Bíblia diz'
    }
    
    curso_title = curso_titles.get(curso, curso)
    
    msg = MimeMultipart()
    msg['From'] = f"{EMAIL_CONFIG['from_name']} <{EMAIL_CONFIG['email']}>"
    msg['To'] = email
    msg['Subject'] = f"Bem-vindo ao curso {curso_title}!"
    
    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c5282;">Olá {nome}!</h2>
            
            <p>Seja bem-vindo ao curso <strong>{curso_title}</strong> da Igreja de Cristo do Centro!</p>
            
            <p>Sua inscrição foi realizada com sucesso. Em breve você receberá os materiais de estudo.</p>
            
            <div style="background: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #3182ce; margin-top: 0;">Próximos Passos:</h3>
                <ul>
                    <li>📚 Você receberá os PDFs das lições via email</li>
                    <li>📱 Manteremos contato pelo WhatsApp</li>
                    <li>❓ Tire suas dúvidas a qualquer momento</li>
                    <li>🏆 Receba seu certificado ao concluir o curso</li>
                </ul>
            </div>
            
            <p>Para começar seus estudos, acesse os materiais através do nosso site.</p>
            
            <p>Deus abençoe seus estudos!</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            
            <p style="font-size: 14px; color: #666;">
                <strong>Igreja de Cristo do Centro</strong><br>
                Av. Sete de Setembro, 1801 - Centro, Manaus/AM<br>
                WhatsApp: (92) 99114-6877
            </p>
        </div>
    </body>
    </html>
    """
    
    msg.attach(MimeText(html_body, 'html'))
    
    try:
        server = smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port'])
        server.starttls()
        server.login(EMAIL_CONFIG['email'], EMAIL_CONFIG['password'])
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print(f"Erro ao enviar email: {e}")
        raise

@app.route('/')
def home():
    """Página inicial da API"""
    return jsonify({
        'message': 'Sistema da Igreja de Cristo do Centro - API Simplificada',
        'version': '2.0',
        'description': 'Sistema SEM LOGIN - Apenas email e WhatsApp necessários',
        'endpoints': {
            'inscricoes': '/api/inscricoes (POST)',
            'pdfs': '/api/pdfs/<curso> (GET)',
            'download': '/api/download/<curso>/<arquivo> (GET)',
            'admin_inscricoes': '/api/admin/inscricoes (GET)',
            'admin_relatorio': '/api/admin/relatorio/<curso> (GET)'
        }
    })

if __name__ == '__main__':
    print("🚀 Iniciando Sistema da Igreja de Cristo do Centro...")
    print("📊 Sistema SEM LOGIN - Apenas email e WhatsApp necessários")
    print("🔗 API disponível em: http://localhost:5000")
    print("📁 PDFs devem ser colocados em: assets/pdfs/")
    print("")
    print("📋 Como usar:")
    print("1. Coloque seus PDFs nas pastas assets/pdfs/dbf/ e assets/pdfs/biblia-diz/")
    print("2. Configure o email no código (EMAIL_CONFIG) se desejar envio automático")
    print("3. Acesse o site e teste as inscrições")
    print("4. Monitore inscrições em /api/admin/inscricoes")
    print("5. Relatórios em /api/admin/relatorio/<curso>")
    print("")
    print("🔧 Para instalar dependências:")
    print("pip install flask flask-cors")
    
    app.run(debug=True, host='0.0.0.0', port=5000)