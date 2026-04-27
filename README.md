# Koinonia

> Plataforma inteligente que conecta instituições a voluntários usando agentes de IA.

## 📌 Sobre este projeto

Este projeto é apresentado como uma solução ao desafio Hackaton 2026 feito pela universidade UNASP. A solução propõe facilitar as instituições que atuam em ações voluntárias a encontrar pessoas que sejam compativeis a sua necessidade, analisando as habilidades de cada um e oferecendo feedback e opção de enviar convites. O voluntário também podera utilizar a plataforma para verificar e responder convites.

## Exemplo de funcionamento

...
Instituição pergunta para assistente >> "Procuro por um voluntario na região de Campinas para ajudar em aulas de musicas para crianças da comunidade"

Agente responde com recomendações e oferece opção de enviar convite

Caso sim, agente envia convite ao voluntário conforme informações cedidas.

...

## Stack

 Camada | Tecnologia |
|---|---|
| **Frontend** | React + Vite |
| **Backend** | Python + FastAPI |
| **Banco de Dados** | Google Firestore |
| **IA / Automação** | IBM watsonx Orchestrate |

## Integração com IBM watsonx Orchestrate

O IBM Orchestrate é responsável por:
    - Analisar perfil dos voluntários.
    - Analisar necessidade da instituição.
    - Enviar convites.

A comunicação acontece via chamadas REST autenticadas pelo backend FastAPI, que atua como intermediário entre as camadas.

## Autoria

**André Pereira de Sá**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andrepereirasa/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/andre-dev-2021)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:andrepereirasa100@gmail.com)