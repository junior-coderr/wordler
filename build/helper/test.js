"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqllite_1 = require("./sqllite");
// Test function to run all tests
function runTests() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting SQLite tests...');
        // // Test 1: Add new user with a word
        try {
            const testChatId = 12345;
            const testWord = { text: "intent", timestamp: new Date().toISOString() };
            const testName = "Test User";
            console.log('\nTest 1: Adding new user with word...');
            (0, sqllite_1.addOrUpdateWord)(testChatId, testWord, testName); // Ensure async/await if the function is async
            const words = (0, sqllite_1.getWords)(testChatId); // Ensure async/await if the function is async
            console.log('Retrieved words:', words);
            // if (words.includes(testWord.text)) {
            //     console.log('✅ Test 1 passed: Word was successfully added');
            // } else {
            //     console.log('❌ Test 1 failed: Word was not found in database');
            // }
        }
        catch (error) {
            console.log('Test 1 error:', error);
        }
        // // Test 2: Update existing user with new word
        try {
            const testChatId = 123456;
            const newWord = "banana";
            console.log('\nTest 2: Adding second word for existing user...');
            yield (0, sqllite_1.addOrUpdateWord)(testChatId, { text: newWord, timestamp: new Date().toISOString() }, "Test User");
            const words = yield (0, sqllite_1.getWords)(testChatId);
            console.log('Retrieved words:', words);
            // if (words.includes(newWord) && words.length > 1) {
            //     console.log('✅ Test 2 passed: Second word was successfully added');
            // } else {
            //     console.log('❌ Test 2 failed: Second word was not found in database');
            // }
        }
        catch (error) {
            console.log('Test 2 error:', error);
        }
        // // Test 3: Try to add duplicate word
        try {
            const testChatId = 123456;
            const duplicateWord = { text: "apple", timestamp: new Date().toISOString() };
            console.log('\nTest 3: Testing duplicate word prevention...');
            yield (0, sqllite_1.addOrUpdateWord)(testChatId, duplicateWord, "Test User"); // Ensure async/await if the function is async
            const words = yield (0, sqllite_1.getWords)(testChatId); // Ensure async/await if the function is async
            console.log('Retrieved words:', words);
            if (words.filter(w => w.text === duplicateWord.text).length === 1) {
                console.log('✅ Test 3 passed: Duplicate word was not added');
            }
            else {
                console.log('❌ Test 3 failed: Duplicate word handling failed');
            }
        }
        catch (error) {
            console.log('Test 3 error:', error);
        }
        // Test 4: Get all users
        try {
            console.log('\nTest 4: Getting all users...');
            const allUsers = (0, sqllite_1.getAllUsers)(); // Ensure async/await if the function is async
            console.log('All users:', allUsers);
        }
        catch (error) {
            console.log('Test 4 error:', error);
        }
        // Test 5: Delete words
        // try {
        //     console.log('\nTest 5: Deleting words...');
        //      deleteWords(); // Ensure async/await if the function is async
        // } catch (error) {
        //     console.error('Test 5 error:', error);
        // }
    });
}
// Run the tests
// runTests().then(() => {
//     console.log('\nAll tests completed!');
// });
const deleteWordsTest = () => {
    try {
        // console.log('\nTest 5: Deleting words...');
        (0, sqllite_1.deleteWords)(); // Ensure async/await if the function is async
    }
    catch (error) {
        console.log('Test 5 error:', error);
    }
};
deleteWordsTest();
const addOrUpdateWordTest = () => {
    try {
        const testChatId = 123456;
        const testWord = { text: "nice", timestamp: new Date().toISOString() };
        const testName = "Test User" + Math.floor(Math.random() * 100);
        console.log('\nTest 1: Adding new user with word...');
        (0, sqllite_1.addOrUpdateWord)(testChatId, testWord, testName); // Ensure async/await if the function is async
        // const words =  getWords(testChatId); // Ensure async/await if the function is async
    }
    catch (error) {
        console.log('Test 1 error:', error);
    }
};
// addOrUpdateWordTest();
const getAllUsersTest = () => {
    const allUsers = (0, sqllite_1.getAllUsers)();
    for (const user of allUsers) {
        // const words = JSON.parse(user.words || '[]');
        // console.log('User:', words[0].text);
        console.log('User:', user);
    }
};
getAllUsersTest();
//# sourceMappingURL=test.js.map