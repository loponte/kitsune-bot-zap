# Changelog

## [Correção Bug Conectividade] - 2024

### Corrigido
- **Bug de conectividade**: O bot agora responde corretamente a mensagens de usuários que estavam sem internet
  - Aumentado o tempo limite de mensagens antigas de 5 para 15 minutos
  - Melhorado o timeout de processamento de eventos de 300ms para 1000ms
  - Adicionados logs de debug para melhor monitoramento
  
### Detalhes Técnicos
- Modificado `isAtLeastMinutesInPast()` em `src/utils/index.js`
- Atualizado `TIMEOUT_IN_MILLISECONDS_BY_EVENT` em `src/config.js`
- Melhorado middleware `onMessagesUpsert` com logs informativos

### Impacto
- Usuários que ficaram offline e voltaram a ter internet agora recebem respostas do bot normalmente
- Melhor experiência em grupos com usuários com conexão instável
- Logs mais informativos para debugging