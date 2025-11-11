import React from 'react';
import './CollectionList.css';

/**
 * Список коллекций и документов
 */
export function CollectionList({ configParser, onSelectCollection, onDeletePage }) {
  const collections = configParser.getCollections();

  const cardStyle = {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '12px'
  };

  return (
    <div>
      <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Выберите страницу для редактирования</h3>
      
      {collections.map(collectionName => {
        const collection = configParser.getCollection(collectionName);
        const documents = Object.keys(collection);

        return (
          <div key={collectionName} style={{marginBottom: '32px'}}>
            <h4 style={{
              marginBottom: '16px',
              fontSize: '18px',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {collectionName}
            </h4>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px'}}>
              {documents.map(docId => (
                <div
                  key={docId}
                  style={{...cardStyle, position: 'relative'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e0e0e0';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div 
                    onClick={() => onSelectCollection(collectionName, docId)}
                    style={{cursor: 'pointer'}}
                  >
                    <div style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px'}}>
                      📄 {docId}
                    </div>
                    <div style={{fontSize: '14px', color: '#666'}}>
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
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.7,
                        transition: 'opacity 0.2s'
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
