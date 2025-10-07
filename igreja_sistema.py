#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sistema de Gestão da Igreja de Cristo do Centro
===============================================

Este módulo contém funcionalidades para auxiliar na gestão da igreja,
incluindo cadastro de membros, controle de cursos e relatórios.

Autor: Igreja de Cristo do Centro
Data: Janeiro 2025
Versão: 1.0.0
"""

import json
import csv
import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any
import sqlite3
import logging

# Configuração do logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('igreja_sistema.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class DatabaseManager:
    """Gerenciador do banco de dados da igreja."""
    
    def __init__(self, db_path: str = "igreja_centro.db"):
        """
        Inicializa o gerenciador do banco de dados.
        
        Args:
            db_path (str): Caminho para o arquivo do banco de dados.
        """
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Inicializa as tabelas do banco de dados."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Tabela de membros
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS membros (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        nome TEXT NOT NULL,
                        email TEXT UNIQUE,
                        telefone TEXT,
                        endereco TEXT,
                        data_batismo DATE,
                        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        ativo BOOLEAN DEFAULT 1
                    )
                ''')
                
                # Tabela de cursos
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS cursos (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        nome TEXT NOT NULL,
                        descricao TEXT,
                        tipo TEXT CHECK(tipo IN ('presencial', 'online')),
                        data_inicio DATE,
                        data_fim DATE,
                        instrutor TEXT,
                        max_participantes INTEGER,
                        ativo BOOLEAN DEFAULT 1
                    )
                ''')
                
                # Tabela de inscrições em cursos
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS inscricoes (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        membro_id INTEGER,
                        curso_id INTEGER,
                        data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        status TEXT CHECK(status IN ('inscrito', 'concluido', 'cancelado')) DEFAULT 'inscrito',
                        FOREIGN KEY (membro_id) REFERENCES membros (id),
                        FOREIGN KEY (curso_id) REFERENCES cursos (id)
                    )
                ''')
                
                # Tabela de reuniões
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS reunioes (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        tipo TEXT NOT NULL,
                        data_reuniao DATE NOT NULL,
                        hora_inicio TIME NOT NULL,
                        hora_fim TIME,
                        tema TEXT,
                        pregador TEXT,
                        observacoes TEXT
                    )
                ''')
                
                # Tabela de presença nas reuniões
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS presencas (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        membro_id INTEGER,
                        reuniao_id INTEGER,
                        presente BOOLEAN DEFAULT 1,
                        FOREIGN KEY (membro_id) REFERENCES membros (id),
                        FOREIGN KEY (reuniao_id) REFERENCES reunioes (id)
                    )
                ''')
                
                conn.commit()
                logger.info("Banco de dados inicializado com sucesso")
                
        except sqlite3.Error as e:
            logger.error(f"Erro ao inicializar banco de dados: {e}")
            raise

class MembroManager:
    """Gerenciador de membros da igreja."""
    
    def __init__(self, db_manager: DatabaseManager):
        """
        Inicializa o gerenciador de membros.
        
        Args:
            db_manager (DatabaseManager): Instância do gerenciador de banco.
        """
        self.db = db_manager
    
    def cadastrar_membro(self, nome: str, email: str = None, telefone: str = None, 
                        endereco: str = None, data_batismo: str = None) -> int:
        """
        Cadastra um novo membro.
        
        Args:
            nome (str): Nome completo do membro.
            email (str, optional): Email do membro.
            telefone (str, optional): Telefone do membro.
            endereco (str, optional): Endereço do membro.
            data_batismo (str, optional): Data do batismo (YYYY-MM-DD).
        
        Returns:
            int: ID do membro cadastrado.
        """
        try:
            with sqlite3.connect(self.db.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO membros (nome, email, telefone, endereco, data_batismo)
                    VALUES (?, ?, ?, ?, ?)
                ''', (nome, email, telefone, endereco, data_batismo))
                
                membro_id = cursor.lastrowid
                conn.commit()
                
                logger.info(f"Membro {nome} cadastrado com ID {membro_id}")
                return membro_id
                
        except sqlite3.Error as e:
            logger.error(f"Erro ao cadastrar membro: {e}")
            raise
    
    def buscar_membro(self, membro_id: int = None, email: str = None) -> Optional[Dict]:
        """
        Busca um membro por ID ou email.
        
        Args:
            membro_id (int, optional): ID do membro.
            email (str, optional): Email do membro.
        
        Returns:
            Optional[Dict]: Dados do membro ou None se não encontrado.
        """
        try:
            with sqlite3.connect(self.db.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                if membro_id:
                    cursor.execute('SELECT * FROM membros WHERE id = ? AND ativo = 1', (membro_id,))
                elif email:
                    cursor.execute('SELECT * FROM membros WHERE email = ? AND ativo = 1', (email,))
                else:
                    return None
                
                row = cursor.fetchone()
                return dict(row) if row else None
                
        except sqlite3.Error as e:
            logger.error(f"Erro ao buscar membro: {e}")
            return None
    
    def listar_membros(self, ativos_apenas: bool = True) -> List[Dict]:
        """
        Lista todos os membros.
        
        Args:
            ativos_apenas (bool): Se True, lista apenas membros ativos.
        
        Returns:
            List[Dict]: Lista de membros.
        """
        try:
            with sqlite3.connect(self.db.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                if ativos_apenas:
                    cursor.execute('SELECT * FROM membros WHERE ativo = 1 ORDER BY nome')
                else:
                    cursor.execute('SELECT * FROM membros ORDER BY nome')
                
                return [dict(row) for row in cursor.fetchall()]
                
        except sqlite3.Error as e:
            logger.error(f"Erro ao listar membros: {e}")
            return []

class CursoManager:
    """Gerenciador de cursos bíblicos."""
    
    def __init__(self, db_manager: DatabaseManager):
        """
        Inicializa o gerenciador de cursos.
        
        Args:
            db_manager (DatabaseManager): Instância do gerenciador de banco.
        """
        self.db = db_manager
    
    def criar_curso(self, nome: str, descricao: str, tipo: str, 
                   data_inicio: str, data_fim: str = None, 
                   instrutor: str = None, max_participantes: int = None) -> int:
        """
        Cria um novo curso.
        
        Args:
            nome (str): Nome do curso.
            descricao (str): Descrição do curso.
            tipo (str): Tipo do curso ('presencial' ou 'online').
            data_inicio (str): Data de início (YYYY-MM-DD).
            data_fim (str, optional): Data de fim (YYYY-MM-DD).
            instrutor (str, optional): Nome do instrutor.
            max_participantes (int, optional): Número máximo de participantes.
        
        Returns:
            int: ID do curso criado.
        """
        try:
            with sqlite3.connect(self.db.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO cursos (nome, descricao, tipo, data_inicio, data_fim, instrutor, max_participantes)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (nome, descricao, tipo, data_inicio, data_fim, instrutor, max_participantes))
                
                curso_id = cursor.lastrowid
                conn.commit()
                
                logger.info(f"Curso {nome} criado com ID {curso_id}")
                return curso_id
                
        except sqlite3.Error as e:
            logger.error(f"Erro ao criar curso: {e}")
            raise
    
    def inscrever_membro(self, membro_id: int, curso_id: int) -> bool:
        """
        Inscreve um membro em um curso.
        
        Args:
            membro_id (int): ID do membro.
            curso_id (int): ID do curso.
        
        Returns:
            bool: True se a inscrição foi bem-sucedida.
        """
        try:
            with sqlite3.connect(self.db.db_path) as conn:
                cursor = conn.cursor()
                
                # Verifica se já existe inscrição
                cursor.execute('''
                    SELECT id FROM inscricoes 
                    WHERE membro_id = ? AND curso_id = ? AND status != 'cancelado'
                ''', (membro_id, curso_id))
                
                if cursor.fetchone():
                    logger.warning(f"Membro {membro_id} já inscrito no curso {curso_id}")
                    return False
                
                # Verifica limite de participantes
                cursor.execute('''
                    SELECT c.max_participantes, COUNT(i.id) as inscritos
                    FROM cursos c
                    LEFT JOIN inscricoes i ON c.id = i.curso_id AND i.status = 'inscrito'
                    WHERE c.id = ?
                    GROUP BY c.id
                ''', (curso_id,))
                
                resultado = cursor.fetchone()
                if resultado and resultado[0] and resultado[1] >= resultado[0]:
                    logger.warning(f"Curso {curso_id} lotado")
                    return False
                
                # Realiza a inscrição
                cursor.execute('''
                    INSERT INTO inscricoes (membro_id, curso_id)
                    VALUES (?, ?)
                ''', (membro_id, curso_id))
                
                conn.commit()
                logger.info(f"Membro {membro_id} inscrito no curso {curso_id}")
                return True
                
        except sqlite3.Error as e:
            logger.error(f"Erro ao inscrever membro: {e}")
            return False
    
    def listar_cursos_ativos(self) -> List[Dict]:
        """
        Lista todos os cursos ativos.
        
        Returns:
            List[Dict]: Lista de cursos ativos.
        """
        try:
            with sqlite3.connect(self.db.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute('''
                    SELECT c.*, COUNT(i.id) as inscritos
                    FROM cursos c
                    LEFT JOIN inscricoes i ON c.id = i.curso_id AND i.status = 'inscrito'
                    WHERE c.ativo = 1
                    GROUP BY c.id
                    ORDER BY c.data_inicio
                ''')
                
                return [dict(row) for row in cursor.fetchall()]
                
        except sqlite3.Error as e:
            logger.error(f"Erro ao listar cursos: {e}")
            return []

class RelatorioManager:
    """Gerenciador de relatórios da igreja."""
    
    def __init__(self, db_manager: DatabaseManager):
        """
        Inicializa o gerenciador de relatórios.
        
        Args:
            db_manager (DatabaseManager): Instância do gerenciador de banco.
        """
        self.db = db_manager
    
    def relatorio_membros(self) -> Dict[str, Any]:
        """
        Gera relatório de membros.
        
        Returns:
            Dict[str, Any]: Dados do relatório de membros.
        """
        try:
            with sqlite3.connect(self.db.db_path) as conn:
                cursor = conn.cursor()
                
                # Total de membros
                cursor.execute('SELECT COUNT(*) FROM membros WHERE ativo = 1')
                total_membros = cursor.fetchone()[0]
                
                # Membros batizados
                cursor.execute('SELECT COUNT(*) FROM membros WHERE ativo = 1 AND data_batismo IS NOT NULL')
                membros_batizados = cursor.fetchone()[0]
                
                # Novos membros este ano
                ano_atual = datetime.datetime.now().year
                cursor.execute('''
                    SELECT COUNT(*) FROM membros 
                    WHERE ativo = 1 AND strftime('%Y', data_cadastro) = ?
                ''', (str(ano_atual),))
                novos_membros_ano = cursor.fetchone()[0]
                
                return {
                    'total_membros': total_membros,
                    'membros_batizados': membros_batizados,
                    'novos_membros_ano': novos_membros_ano,
                    'data_relatorio': datetime.datetime.now().isoformat()
                }
                
        except sqlite3.Error as e:
            logger.error(f"Erro ao gerar relatório de membros: {e}")
            return {}
    
    def relatorio_cursos(self) -> Dict[str, Any]:
        """
        Gera relatório de cursos.
        
        Returns:
            Dict[str, Any]: Dados do relatório de cursos.
        """
        try:
            with sqlite3.connect(self.db.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                # Cursos por tipo
                cursor.execute('''
                    SELECT tipo, COUNT(*) as quantidade
                    FROM cursos
                    WHERE ativo = 1
                    GROUP BY tipo
                ''')
                cursos_por_tipo = dict(cursor.fetchall())
                
                # Inscrições por curso
                cursor.execute('''
                    SELECT c.nome, COUNT(i.id) as inscritos
                    FROM cursos c
                    LEFT JOIN inscricoes i ON c.id = i.curso_id AND i.status = 'inscrito'
                    WHERE c.ativo = 1
                    GROUP BY c.id, c.nome
                    ORDER BY inscritos DESC
                ''')
                inscricoes_por_curso = [dict(row) for row in cursor.fetchall()]
                
                return {
                    'cursos_por_tipo': cursos_por_tipo,
                    'inscricoes_por_curso': inscricoes_por_curso,
                    'data_relatorio': datetime.datetime.now().isoformat()
                }
                
        except sqlite3.Error as e:
            logger.error(f"Erro ao gerar relatório de cursos: {e}")
            return {}
    
    def exportar_para_csv(self, dados: List[Dict], nome_arquivo: str):
        """
        Exporta dados para arquivo CSV.
        
        Args:
            dados (List[Dict]): Lista de dicionários com os dados.
            nome_arquivo (str): Nome do arquivo CSV.
        """
        try:
            if not dados:
                logger.warning("Nenhum dado para exportar")
                return
            
            with open(nome_arquivo, 'w', newline='', encoding='utf-8') as csvfile:
                fieldnames = dados[0].keys()
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                
                writer.writeheader()
                for linha in dados:
                    writer.writerow(linha)
                
                logger.info(f"Dados exportados para {nome_arquivo}")
                
        except Exception as e:
            logger.error(f"Erro ao exportar CSV: {e}")

def inicializar_dados_exemplo():
    """Inicializa o sistema com dados de exemplo."""
    logger.info("Inicializando dados de exemplo...")
    
    # Inicializar banco de dados
    db = DatabaseManager()
    membro_mgr = MembroManager(db)
    curso_mgr = CursoManager(db)
    relatorio_mgr = RelatorioManager(db)
    
    # Cadastrar membros de exemplo
    try:
        membro1 = membro_mgr.cadastrar_membro(
            nome="João Silva",
            email="joao@exemplo.com",
            telefone="(92) 99999-1111",
            endereco="Rua das Flores, 123",
            data_batismo="2024-06-15"
        )
        
        membro2 = membro_mgr.cadastrar_membro(
            nome="Maria Santos",
            email="maria@exemplo.com",
            telefone="(92) 99999-2222",
            endereco="Av. Principal, 456",
            data_batismo="2024-08-20"
        )
        
        membro3 = membro_mgr.cadastrar_membro(
            nome="Pedro Oliveira",
            email="pedro@exemplo.com",
            telefone="(92) 99999-3333",
            endereco="Rua da Igreja, 789"
        )
        
        # Criar cursos de exemplo
        curso1 = curso_mgr.criar_curso(
            nome="DBF - Deixe a Bíblia Falar",
            descricao="Curso completo sobre fundamentos bíblicos cristãos",
            tipo="presencial",
            data_inicio="2025-02-01",
            data_fim="2025-04-26",
            instrutor="Irmão Paulo",
            max_participantes=20
        )
        
        curso2 = curso_mgr.criar_curso(
            nome="DBF - Online",
            descricao="Versão online do curso DBF",
            tipo="online",
            data_inicio="2025-01-15",
            data_fim="2025-02-26",
            instrutor="Irmão Lucas",
            max_participantes=50
        )
        
        curso3 = curso_mgr.criar_curso(
            nome="O que a Bíblia diz",
            descricao="Estudos temáticos sobre doutrinas bíblicas",
            tipo="online",
            data_inicio="2025-01-08",
            data_fim="2025-02-05",
            instrutor="Irmã Ana"
        )
        
        # Inscrever membros nos cursos
        curso_mgr.inscrever_membro(membro1, curso1)
        curso_mgr.inscrever_membro(membro2, curso1)
        curso_mgr.inscrever_membro(membro3, curso2)
        curso_mgr.inscrever_membro(membro1, curso3)
        
        logger.info("Dados de exemplo inicializados com sucesso!")
        
        # Gerar relatórios
        print("\n=== RELATÓRIO DE MEMBROS ===")
        rel_membros = relatorio_mgr.relatorio_membros()
        for chave, valor in rel_membros.items():
            print(f"{chave.replace('_', ' ').title()}: {valor}")
        
        print("\n=== RELATÓRIO DE CURSOS ===")
        rel_cursos = relatorio_mgr.relatorio_cursos()
        print("Cursos por tipo:")
        for tipo, qtd in rel_cursos.get('cursos_por_tipo', {}).items():
            print(f"  {tipo.title()}: {qtd}")
        
        print("\nInscrições por curso:")
        for curso in rel_cursos.get('inscricoes_por_curso', []):
            print(f"  {curso['nome']}: {curso['inscritos']} inscritos")
        
        # Exportar dados
        membros = membro_mgr.listar_membros()
        relatorio_mgr.exportar_para_csv(membros, "membros_export.csv")
        
        cursos = curso_mgr.listar_cursos_ativos()
        relatorio_mgr.exportar_para_csv(cursos, "cursos_export.csv")
        
        print("\n✅ Sistema inicializado com sucesso!")
        print("📄 Arquivos CSV exportados: membros_export.csv, cursos_export.csv")
        print("🗃️ Banco de dados criado: igreja_centro.db")
        
    except Exception as e:
        logger.error(f"Erro ao inicializar dados: {e}")
        print(f"❌ Erro: {e}")

def main():
    """Função principal do sistema."""
    print("🏛️ Sistema de Gestão - Igreja de Cristo do Centro")
    print("=" * 50)
    
    while True:
        print("\nEscolha uma opção:")
        print("1. Inicializar dados de exemplo")
        print("2. Cadastrar novo membro")
        print("3. Listar membros")
        print("4. Criar novo curso")
        print("5. Listar cursos")
        print("6. Gerar relatórios")
        print("0. Sair")
        
        opcao = input("\nOpção: ").strip()
        
        if opcao == "0":
            print("👋 Encerrando sistema...")
            break
        elif opcao == "1":
            inicializar_dados_exemplo()
        elif opcao == "2":
            # Implementar cadastro interativo
            print("📝 Funcionalidade em desenvolvimento...")
        elif opcao == "3":
            # Implementar listagem interativa
            print("📋 Funcionalidade em desenvolvimento...")
        elif opcao == "4":
            # Implementar criação de curso interativa
            print("🎓 Funcionalidade em desenvolvimento...")
        elif opcao == "5":
            # Implementar listagem de cursos
            print("📚 Funcionalidade em desenvolvimento...")
        elif opcao == "6":
            # Implementar geração de relatórios
            print("📊 Funcionalidade em desenvolvimento...")
        else:
            print("❌ Opção inválida!")

if __name__ == "__main__":
    main()