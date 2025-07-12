import * as FileSystem from 'expo-file-system';

const deleteDatabase = async () => {
  const dbName = 'DAIRYMAN.db'; // Replace with your database name
  const dbPath = `${FileSystem.documentDirectory}${dbName}`;

  try {
    const fileExists = await FileSystem.getInfoAsync(dbPath);
    if (fileExists.exists) {
      await FileSystem.deleteAsync(dbPath);
      console.log('Database deleted successfully!');
    } else {
      console.log('Database file does not exist.');
    }
  } catch (error) {
    console.error('Error deleting database:', error);
  }
};

deleteDatabase();