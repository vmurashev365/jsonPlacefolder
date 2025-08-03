# 📊 Detailed Logging in JSONPlaceholder API Tests

## 🎯 Methods to Get Detailed Logs

### 1. **Environment Variables** (PowerShell)

```powershell
# Debug level logging (maximum details)
$env:LOG_LEVEL="debug"; npm run test:smoke

# Info level (standard details)  
$env:LOG_LEVEL="info"; npm run test:comments

# Clear variable
Remove-Item Env:LOG_LEVEL
```

### 2. **Verbose Commands** (detailed scenario output)

```bash
# Detailed smoke tests
npm run test:smoke:verbose

# Detailed comments tests  
npm run test:comments:verbose

# Detailed posts tests
npm run test:posts:verbose

# Detailed users tests
npm run test:users:verbose

# All tests with detailed output
npm run test:verbose
```

### 3. **Combined Approach** (maximum information)

```powershell
# Maximum detail level
$env:LOG_LEVEL="debug"; npm run test:comments:verbose
```

### 4. **Direct Cucumber Commands**

```bash
# Specific feature file with details
npx cucumber-js features/comments/comments_crud.feature \
  --require-module ts-node/register \
  --require src/hooks/**/*.ts \
  --require src/steps/**/*.ts \
  --format @cucumber/pretty-formatter \
  --parallel 1

# With specific tags
npx cucumber-js \
  --tags "@comments and @get and @all" \
  --format @cucumber/pretty-formatter \
  --parallel 1
```

## 📋 What Each Level Shows

### **LOG_LEVEL=info** (standard)
```
✅ PASS: Response data should be an array {"expected":"array","actual":"array"}  
🔄 Getting all comments
✅ Get all comments completed
🔗 Base URL confirmed: https://jsonplaceholder.typicode.com
```

### **LOG_LEVEL=debug** (maximum)
```
Request config: {"url":"/comments","method":"get","headers":{...}}
Response: {"status":200,"statusText":"OK","headers":{...},"data":[...]}
🔄 GET /comments
✅ 200 OK  
```

### **--format @cucumber/pretty-formatter** (test structure)
```
Feature: Comments API - CRUD Operations
  @comments @crud @positive @comments @get @all
  Scenario: Get all comments# features\comments\comments_crud.feature:11
    ✔ Given the base URL is "https://jsonplaceholder.typicode.com"
    ✔ When I get all comments
    ✔ Then the response should have status code 200
    ✔ And the response should be JSON
    ✔ And the response data should be an array
    ✔ And the response data should have 500 items
```

## 🛠️ Configuration Settings

### **cucumber.js** profiles:
- `default` - normal run with progress-bar
- `smoke` - fast smoke tests  
- `verbose` - detailed output, no parallelism
- `debug` - debug mode
- `ci` - for CI/CD pipelines

### **package.json** scripts:
- `test:*` - normal tests with brief output
- `test:*:verbose` - tests with detailed output  
- `test:debug` - maximum detail

## 💡 Practical Examples

### Debug specific test:
```powershell
$env:LOG_LEVEL="debug"; npx cucumber-js features/comments/comments_crud.feature --tags "@comments and @post and @create" --format @cucumber/pretty-formatter --parallel 1
```

### Quick check with details:
```bash
npm run test:smoke:verbose
```

### Full comments analysis:
```powershell
$env:LOG_LEVEL="debug"; npm run test:comments:verbose
```

## 📊 Output Comparison

| Command | Test Structure | Request Details | Assertion Logs | Execution Time |
|---------|----------------|-----------------|----------------|----------------|
| `npm run test:smoke` | ❌ | ❌ | ❌ | Fast |
| `npm run test:smoke:verbose` | ✅ | ❌ | ✅ | Medium |
| `LOG_LEVEL=debug npm run test:smoke` | ❌ | ✅ | ✅ | Medium |
| `LOG_LEVEL=debug npm run test:smoke:verbose` | ✅ | ✅ | ✅ | Detailed |

## 🎯 Recommendations

### For development:
```bash
npm run test:comments:verbose
```

### For debugging:  
```powershell
$env:LOG_LEVEL="debug"; npm run test:comments:verbose
```

### For CI/CD:
```bash
npm run test:smoke  # fast and brief
```

### For demonstration:
```bash
npm run test:smoke:verbose  # clear and understandable
```
