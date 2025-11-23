# Contributing to McJohnson Mini App Developer SDK

Thank you for your interest in contributing! This document provides guidelines for contributing to the SDK.

---

## 🎯 Ways to Contribute

### 1. Report Bugs

Found a bug? Please open an issue with:

- **Clear title** - Describe the issue briefly
- **Steps to reproduce** - How to trigger the bug
- **Expected behavior** - What should happen
- **Actual behavior** - What actually happens
- **Environment** - OS, Node version, SDK version
- **Screenshots** - If applicable

**Example**:
```
Title: `mcj dev` fails with EADDRINUSE on port 3000

Steps:
1. Run `mcj dev` in project directory
2. Port 3000 is already in use
3. Command fails instead of offering alternative port

Expected: Should auto-increment to 3001
Actual: Crashes with error

Environment: macOS 14.2, Node 20.10.0, SDK 1.0.0
```

### 2. Suggest Features

Have an idea? Open an issue with:

- **Use case** - Why is this needed?
- **Proposed solution** - How should it work?
- **Alternatives** - Other ways to solve this?
- **Examples** - Similar features in other tools

### 3. Improve Documentation

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add examples or tutorials
- Improve API documentation
- Translate to other languages

### 4. Submit Code

Ready to code? Follow the guidelines below.

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 16+ and npm
- Git
- Code editor (VS Code recommended)

### Setup
```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/mcjohnson-sdk.git
cd mcjohnson-sdk

# Install dependencies
npm install

# Link for local testing
npm link

# Test the CLI
mcj --help
```

### Project Structure
```
mcjohnson-sdk/
├── cli/
│   └── mcj-cli.js          # Main CLI entry point
├── packager/
│   └── package-miniapp.js  # Build functionality
├── tools/
│   ├── sign-cli.js         # Signing tools
│   ├── verify.js           # Signature verification
│   ├── publish-ipfs.js     # IPFS publishing
│   └── dev-server.js       # Development server
├── templates/
│   └── starter/            # Starter template
├── utils/
│   └── manifest.js         # Manifest validation
├── types/
│   └── index.d.ts          # TypeScript definitions
└── tests/
    └── test-manifest.js    # Unit tests
```

---

## 📝 Code Guidelines

### Code Style

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Add **semicolons**
- Use **const** and **let**, not **var**
- Use **async/await**, not callbacks

**Example**:
```javascript
// ✅ Good
const fs = require('fs');

async function readManifest(path) {
  const content = await fs.promises.readFile(path, 'utf8');
  return JSON.parse(content);
}

// ❌ Bad
var fs = require("fs")

function readManifest(path, callback) {
  fs.readFile(path, "utf8", function(err, data) {
    callback(JSON.parse(data))
  })
}
```

### Error Handling

Always provide helpful error messages:
```javascript
// ✅ Good
if (!fs.existsSync('manifest.json')) {
  console.error('❌ manifest.json not found');
  console.error('   Run this command in your mini app directory');
  process.exit(1);
}

// ❌ Bad
if (!fs.existsSync('manifest.json')) {
  throw new Error('File not found');
}
```

### Console Output

Use consistent formatting:
```javascript
// Success
console.log('✅ Build complete: dist.zip');

// Error
console.error('❌ Build failed: Missing manifest.json');

// Warning
console.warn('⚠️  Icon size is small (recommended: 512x512)');

// Info
console.log('📦 Packaging files...');
```

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Add Tests

When adding new features, include tests:
```javascript
// tests/test-new-feature.js
const { myNewFunction } = require('../utils/new-feature');

console.log('🧪 Testing new feature...\n');

// Test 1: Valid input
const result1 = myNewFunction('valid-input');
console.log(result1 === 'expected' ? '✅ Test 1: PASS' : '❌ Test 1: FAIL');

// Test 2: Invalid input
try {
  myNewFunction(null);
  console.log('❌ Test 2: FAIL (should have thrown)');
} catch (error) {
  console.log('✅ Test 2: PASS');
}

console.log('\n✅ All tests completed!');
```

### Manual Testing

Test CLI commands manually:
```bash
# Test init
cd /tmp
mcj init test-app
cd test-app

# Test build
mcj build

# Test dev server
mcj dev

# Test signing
mcj sign gen-keys
mcj sign sign manifest.json

# Test validation
mcj test
```

---

## 📤 Pull Request Process

### 1. Create a Branch
```bash
git checkout -b feature/my-new-feature
# or
git checkout -b fix/bug-description
```

### 2. Make Changes

- Write clean, documented code
- Add tests for new features
- Update documentation if needed
- Follow code style guidelines

### 3. Commit

Use clear commit messages:
```bash
# Feature
git commit -m "Add QR code generation to dev server"

# Bug fix
git commit -m "Fix: dev server port conflict handling"

# Documentation
git commit -m "Docs: add examples for camera API"

# Refactor
git commit -m "Refactor: simplify manifest validation logic"
```

### 4. Push and Create PR
```bash
git push origin feature/my-new-feature
```

Then open a Pull Request on GitHub with:

- **Clear title** - Describe what the PR does
- **Description** - Explain why this change is needed
- **Testing** - How you tested the changes
- **Screenshots** - If applicable
- **Breaking changes** - If any

**PR Template**:
```markdown
## Description
Brief explanation of the changes

## Motivation
Why is this needed?

## Changes
- Added X feature
- Fixed Y bug
- Updated Z documentation

## Testing
- [ ] Tested manually
- [ ] Added unit tests
- [ ] Tested on macOS
- [ ] Tested on Linux/Windows

## Screenshots (if applicable)
[Add screenshots]

## Breaking Changes
None / List any breaking changes
```

### 5. Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, it will be merged

---

## 🎨 Documentation Guidelines

### Markdown Style

- Use **clear headings** (##, ###)
- Add **code examples** for everything
- Use **emoji sparingly** (✅ ❌ ⚠️ 📦 🚀)
- Keep lines under **100 characters**
- Add **links** to related sections

### Code Examples

Always include:
- ✅ **Good** examples (what to do)
- ❌ **Bad** examples (what not to do)
- **Comments** explaining why
```javascript
// ✅ Good - handles errors gracefully
try {
  const result = await window.mcj.wallet.sign(tx);
  if (!result.ok) {
    console.error('Transaction failed:', result.error);
    return;
  }
  console.log('Success!', result.result.txHash);
} catch (error) {
  console.error('Unexpected error:', error);
}

// ❌ Bad - no error handling
const result = await window.mcj.wallet.sign(tx);
console.log(result.result.txHash);
```

---

## 🚫 What Not to Do

- ❌ Submit PRs without testing
- ❌ Make breaking changes without discussion
- ❌ Copy code without attribution
- ❌ Ignore code style guidelines
- ❌ Add unnecessary dependencies
- ❌ Commit API keys or secrets

---

## ✅ Checklist Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass (`npm test`)
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] No merge conflicts
- [ ] PR description is complete

---

## 🏆 Recognition

Contributors will be:
- Added to [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- Mentioned in release notes
- Eligible for community rewards

---

## 💬 Questions?

- 📧 Email: [Supprt Team](mailto:esithole937@gmail.com)
- 💬 Discord: [Join Community](https://discord.gg/Zcy6mV76)
- 🐛 Issues: [GitHub Issues](https://github.com/etsgoc/mcjohnson-sdk/issues)

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to McJohnson Mini App SDK!** 🎉
