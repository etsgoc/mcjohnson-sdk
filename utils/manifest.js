// utils/manifest.js
const VALID_PERMISSIONS = [
  'wallet', 'username', 'sign', 'camera', 'location', 
  'storage', 'notifications', 'microphone', 'contacts', 'biometrics'
];

function validateManifest(manifest) {
  const errors = [];
  
  // Required fields
  if (!manifest.name || typeof manifest.name !== 'string') {
    errors.push('name is required and must be a string');
  }
  
  if (!manifest.version || typeof manifest.version !== 'string') {
    errors.push('version is required and must be a string');
  }
  
  if (!manifest.entry || typeof manifest.entry !== 'string') {
    errors.push('entry is required and must be a string');
  }
  
  if (!manifest.description || typeof manifest.description !== 'string') {
    errors.push('description is required');
  }
  
  if (!manifest.developer || typeof manifest.developer !== 'string') {
    errors.push('developer is required');
  }
  
  // Optional but validated fields
  if (manifest.permissions) {
    if (!Array.isArray(manifest.permissions)) {
      errors.push('permissions must be an array');
    } else {
      const invalid = manifest.permissions.filter(p => !VALID_PERMISSIONS.includes(p));
      if (invalid.length > 0) {
        errors.push(`invalid permissions: ${invalid.join(', ')}`);
      }
    }
  }
  
  if (manifest.icons && typeof manifest.icons !== 'object') {
    errors.push('icons must be an object');
  }
  
  return {
    ok: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

module.exports = { validateManifest, VALID_PERMISSIONS };