import { addOrUpdateWord, getWords, getAllUsers, deleteWords } from './sqllite';

// Test function to run all tests
async function runTests() {
    console.log('Starting SQLite tests...');

    // // Test 1: Add new user with a word
    try {
        const testChatId = 12345;
        const testWord = { text: "intent", timestamp: new Date().toISOString() };
        const testName = "Test User";
        
        console.log('\nTest 1: Adding new user with word...');
         addOrUpdateWord(testChatId, testWord, testName); // Ensure async/await if the function is async
        
        const words =  getWords(testChatId); // Ensure async/await if the function is async
        console.log('Retrieved words:', words);
        
        // if (words.includes(testWord.text)) {
        //     console.log('✅ Test 1 passed: Word was successfully added');
        // } else {
        //     console.log('❌ Test 1 failed: Word was not found in database');
        // }
    } catch (error) {
        console.error('Test 1 error:', error);
    }

    // // Test 2: Update existing user with new word
    try {
        const testChatId = 123456;
        const newWord = "banana";
        
        console.log('\nTest 2: Adding second word for existing user...');
        await addOrUpdateWord(testChatId, { text: newWord, timestamp: new Date().toISOString() }, "Test User");
        
        const words = await getWords(testChatId);
        console.log('Retrieved words:', words);
        
        // if (words.includes(newWord) && words.length > 1) {
        //     console.log('✅ Test 2 passed: Second word was successfully added');
        // } else {
        //     console.log('❌ Test 2 failed: Second word was not found in database');
        // }
    } catch (error) {
        console.error('Test 2 error:', error);
    }

    // // Test 3: Try to add duplicate word
    try {
        const testChatId = 123456;
        const duplicateWord = { text: "apple", timestamp: new Date().toISOString() };
        
        console.log('\nTest 3: Testing duplicate word prevention...');
        await addOrUpdateWord(testChatId, duplicateWord, "Test User"); // Ensure async/await if the function is async
        
        const words = await getWords(testChatId); // Ensure async/await if the function is async
        console.log('Retrieved words:', words);
        
        if (words.filter(w => w.text === duplicateWord.text).length === 1) {
            console.log('✅ Test 3 passed: Duplicate word was not added');
        } else {
            console.log('❌ Test 3 failed: Duplicate word handling failed');
        }
    } catch (error) {
        console.error('Test 3 error:', error);
    }

    // Test 4: Get all users
    try {
        console.log('\nTest 4: Getting all users...');
        const allUsers =  getAllUsers(); // Ensure async/await if the function is async
        console.log('All users:', allUsers);
    } catch (error) {
        console.error('Test 4 error:', error);
    }

    // Test 5: Delete words
    // try {
    //     console.log('\nTest 5: Deleting words...');
    //      deleteWords(); // Ensure async/await if the function is async
    // } catch (error) {
    //     console.error('Test 5 error:', error);
    // }
}

// Run the tests
// runTests().then(() => {
//     console.log('\nAll tests completed!');
// });

const deleteWordsTest = () => {
  try {
        // console.log('\nTest 5: Deleting words...');
         deleteWords(); // Ensure async/await if the function is async
    } catch (error) {
        console.error('Test 5 error:', error);
    }
}
deleteWordsTest();

const addOrUpdateWordTest = () => {
  try {

    
    const testChatId = 123456;
    const testWord = { text: "nice", timestamp: new Date().toISOString() };
    const testName = "Test User"+Math.floor(Math.random() * 100);
    
    console.log('\nTest 1: Adding new user with word...');
     addOrUpdateWord(testChatId, testWord, testName); // Ensure async/await if the function is async
    
    // const words =  getWords(testChatId); // Ensure async/await if the function is async

} catch (error) {
    console.error('Test 1 error:', error);
}
}

// addOrUpdateWordTest();
const getAllUsersTest = () => {
    const allUsers = getAllUsers();
    for (const user of allUsers) {
      // const words = JSON.parse(user.words || '[]');
        // console.log('User:', words[0].text);
        console.log('User:', user);
    }
}

getAllUsersTest();