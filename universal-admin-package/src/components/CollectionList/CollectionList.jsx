import React from 'react';
import './CollectionList.css';

/**
 * Список коллекций и документов
 */
export function CollectionList({ configParser, onSelectCollection, onDeletePage }) {
  const collections = configParser.getCollections();

  const cardStyle = {
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
  };

  return (
    <div>
      <h3 style={{marginBottom: '32px', fontSize: '24px', fontWeight: '600', color: '#1e293b'}}>Выберите страницу для редактирования</h3>
      
      {collections.map(collectionName => {
        const collection = configParser.getCollection(collectionName);
        const documents = Object.keys(collection);

        return (
          <div key={collectionName} style={{marginBottom: '32px'}}>
            <h4 style={{
              marginBottom: '16px',
              fontSize: '16px',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: '600'
            }}>
              {collectionName}
            </h4>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px'}}>
              {documents.map(docId => (
                <div
                  key={docId}
                  style={{...cardStyle, position: 'relative'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div 
                    onClick={() => onSelectCollection(collectionName, docId)}
                    style={{cursor: 'pointer'}}
                  >
                    <div style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1e293b'}}>
                      📄 {docId}
                    </div>
                    <div style={{fontSize: '14px', color: '#64748b'}}>
                      {Object.keys(collection[docId]).length} полей
                    </div>
                  </div>
                  
                  {/* Кнопка удаления */}
                  {onDeletePage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Удалить страницу "${docId}"?\n\nЭто действие нельзя отменить!`)) {
                          onDeletePage(collectionName, docId);
                        }
                      }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        borderRadius: '8px',
                        width: '28px',
                        height: '28px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.7,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                      title={`Удалить страницу ${docId}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
