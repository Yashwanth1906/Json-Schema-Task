import { initTable, addRecord, updateRecord, deleteRecord, getAllRecords } from '../controllers/tableContent.js';
import { docs } from '../docsSetup.js';

// Mock the Google Docs API
jest.mock('../docsSetup.js', () => ({
  docs: {
    documents: {
      get: jest.fn(),
      batchUpdate: jest.fn()
    }
  }
}));

describe('Table Operations', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('initTable', () => {
    it('should initialize table format when it does not exist', async () => {
      // Mock document content without table format
      docs.documents.get.mockResolvedValue({
        data: {
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: 'Some content' } }]
                }
              }
            ]
          }
        }
      });

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await initTable(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Table format initialized successfully'
      });
    });

    it('should return error when table format already exists', async () => {
      // Mock document content with existing table format
      docs.documents.get.mockResolvedValue({
        data: {
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: '/* TABLE FORMAT START */' } }]
                }
              }
            ]
          }
        }
      });

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await initTable(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Table format already exists'
      });
    });
  });

  describe('addRecord', () => {
    it('should add a new record successfully', async () => {
      // Mock document content with table format
      docs.documents.get.mockResolvedValue({
        data: {
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: '/* TABLE FORMAT START */' } }]
                }
              },
              {
                paragraph: {
                  elements: [{ textRun: { content: 'USERNAME' } }]
                }
              },
              {
                paragraph: {
                  elements: [{ textRun: { content: '/* TABLE FORMAT END */' } }]
                }
              }
            ]
          }
        }
      });

      const req = {
        body: {
          username: 'testUser',
          email: 'test@example.com',
          isCertificateIssued: 'NO'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await addRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Record added successfully.'
      });
    });

    it('should return error when table format is not found', async () => {
      // Mock document content without table format
      docs.documents.get.mockResolvedValue({
        data: {
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: 'Some content' } }]
                }
              }
            ]
          }
        }
      });

      const req = {
        body: {
          username: 'testUser',
          email: 'test@example.com',
          isCertificateIssued: 'NO'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await addRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Table format not found'
      });
    });
  });

  describe('updateRecord', () => {
    it('should update a record successfully', async () => {
      // Mock document content with existing record
      docs.documents.get.mockResolvedValue({
        data: {
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: '/* TABLE FORMAT START */' } }]
                }
              },
              {
                paragraph: {
                  elements: [{ textRun: { content: 'USERNAME' } }]
                }
              },
              {
                paragraph: {
                  elements: [{ textRun: { content: 'oldUser test@example.com NO' } }]
                }
              },
              {
                paragraph: {
                  elements: [{ textRun: { content: '/* TABLE FORMAT END */' } }]
                }
              }
            ]
          }
        }
      });

      const req = {
        body: {
          email: 'test@example.com',
          newValue: 'newUser',
          updateType: 'username'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Record updated successfully.'
      });
    });

    it('should return error when record is not found', async () => {
      // Mock document content with table format but without the target record
      docs.documents.get.mockResolvedValue({
        data: {
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: '/* TABLE FORMAT START */' } }]
                }
              },
              {
                paragraph: {
                  elements: [{ textRun: { content: 'USERNAME' } }]
                }
              },
              {
                paragraph: {
                  elements: [{ textRun: { content: '/* TABLE FORMAT END */' } }]
                }
              }
            ]
          }
        }
      });

      const req = {
        body: {
          email: 'nonexistent@example.com',
          newValue: 'newUser',
          updateType: 'username'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Record with given email not found'
      });
    });
  });

  describe('deleteRecord', () => {
    it('should delete a record successfully', async () => {
      // Mock document content with existing record
      docs.documents.get.mockResolvedValue({
        data: {
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: '/* TABLE FORMAT START */' } }]
                }
              },
              {
                paragraph: {
                  elements: [{ textRun: { content: 'USERNAME' } }]
                }
              },
              {
                paragraph: {
                  elements: [{ textRun: { content: 'testUser test@example.com NO' } }]
                }
              },
              {
                paragraph: {
                  elements: [{ textRun: { content: '/* TABLE FORMAT END */' } }]
                }
              }
            ]
          }
        }
      });

      const req = {
        body: {
          email: 'test@example.com'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await deleteRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Record deleted successfully.'
      });
    });
  });
}); 