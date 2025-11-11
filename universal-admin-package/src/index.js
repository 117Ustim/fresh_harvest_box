// Адаптеры
export { DatabaseAdapter } from './adapters/DatabaseAdapter.js';
export { FirebaseAdapter } from './adapters/FirebaseAdapter.js';
export { RestApiAdapter } from './adapters/RestApiAdapter.js';
export { StorageAdapter } from './adapters/StorageAdapter.js';
export { CloudinaryAdapter } from './adapters/CloudinaryAdapter.js';

// Core
export { CrudManager } from './core/CrudManager.js';
export { ConfigParser } from './config/ConfigParser.js';

// Компоненты
export { AdminPanel } from './components/AdminPanel/AdminPanel.jsx';
export { AdminTrigger } from './components/AdminTrigger/AdminTrigger.jsx';
export { CreatePageModal } from './components/CreatePageModal/CreatePageModal.jsx';
export { DynamicDocumentEditor } from './components/DynamicDocumentEditor/DynamicDocumentEditor.jsx';

// Context
export { AdminProvider, useAdminContext } from './context/AdminContext.jsx';

// Хуки
export { useContent, useMultipleContent } from './hooks/useContent.js';

// Утилиты
export { ConfigManager } from './utils/configManager.js';
export { initAdmin, getAdminInstance, isAdminInitialized, resetAdmin } from './utils/initAdmin.js';
