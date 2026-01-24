# Troubleshooting - Agenndar

Este documento contém soluções para problemas comuns durante o desenvolvimento.

## 💾 Erro: ENOSPC - No space left on device

### Problema
```
npm error code ENOSPC
npm error syscall write
npm error errno -4055
npm error nospc ENOSPC: no space left on device, write
```

### Soluções

#### 1. Limpar cache do npm
```bash
npm cache clean --force
```

#### 2. Limpar node_modules e reinstalar
```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

#### 3. Limpar espaço em disco
- Verifique o espaço disponível no disco
- Delete arquivos temporários
- Limpe a lixeira
- Use ferramentas de limpeza de disco do Windows

#### 4. Mudar localização do cache do npm
```bash
# Criar novo diretório para cache
npm config set cache "C:\npm-cache"

# Ou usar um disco diferente
npm config set cache "D:\npm-cache"
```

#### 5. Instalar dependências uma por uma (último recurso)
Se o problema persistir, tente instalar as dependências principais primeiro:
```bash
npm install next react react-dom
npm install @supabase/supabase-js firebase
npm install framer-motion @dnd-kit/core recharts
# ... continue com as outras
```

## 🔧 Outros Problemas Comuns

### Erro: Module not found
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` novamente
- Delete `node_modules` e `.next` e reinstale

### Erro: Port already in use
```bash
# Windows - Encontrar processo na porta 3000
netstat -ano | findstr :3000

# Matar processo (substitua PID pelo número encontrado)
taskkill /PID <PID> /F
```

### Erro: TypeScript errors
- Verifique se `tsconfig.json` está correto
- Execute `npm run build` para ver erros completos
- Verifique se os tipos estão instalados: `@types/node`, `@types/react`

### Erro: Supabase connection
- Verifique as variáveis de ambiente
- Confirme que a URL e chaves estão corretas
- Verifique se o projeto Supabase está ativo

### Erro: Firebase Auth
- Verifique se o Firebase está configurado
- Confirme que o método Google está habilitado
- Verifique as variáveis de ambiente

## 📚 Recursos Adicionais

- [Documentação npm](https://docs.npmjs.com/)
- [Next.js Troubleshooting](https://nextjs.org/docs/app/building-your-application/configuring/debugging)
- [Supabase Support](https://supabase.com/docs/guides/platform/troubleshooting)

