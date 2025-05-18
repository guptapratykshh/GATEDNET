// Test script for Poll API Integration
import { 
  createPoll, 
  getAllPolls, 
  getPollById, 
  closePoll, 
  deletePoll 
} from './api/polls';

// Mock poll data
const testPollData = {
  title: "Test Poll",
  description: "This is a test poll for API integration",
  options: [
    { text: "Option 1" },
    { text: "Option 2" },
    { text: "Option 3" }
  ],
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
};

// Test functions
async function runTests() {
  console.log("🧪 Starting Poll API Integration Tests");
  console.log("--------------------------------------");

  let createdPollId = null;

  // Test 1: Create a new poll
  console.log("📝 Test 1: Creating a new poll");
  try {
    const createResponse = await createPoll(testPollData);
    if (createResponse.error) {
      console.error("❌ Failed to create poll:", createResponse.error);
    } else {
      console.log("✅ Poll created successfully with ID:", createResponse._id);
      createdPollId = createResponse._id;
    }
  } catch (error) {
    console.error("❌ Exception:", error.message);
  }

  // Exit if poll creation failed
  if (!createdPollId) {
    console.log("⛔ Stopping tests as poll creation failed");
    return;
  }

  // Test 2: Get all polls
  console.log("\n📋 Test 2: Fetching all polls");
  try {
    const getAllResponse = await getAllPolls();
    if (getAllResponse.error) {
      console.error("❌ Failed to fetch polls:", getAllResponse.error);
    } else {
      console.log(`✅ Fetched ${getAllResponse.polls?.length} polls`);
    }
  } catch (error) {
    console.error("❌ Exception:", error.message);
  }

  // Test 3: Get poll by ID
  console.log("\n🔍 Test 3: Fetching poll by ID");
  try {
    const getPollResponse = await getPollById(createdPollId);
    if (getPollResponse.error) {
      console.error("❌ Failed to fetch poll:", getPollResponse.error);
    } else {
      console.log("✅ Poll fetched successfully:", getPollResponse.title);
    }
  } catch (error) {
    console.error("❌ Exception:", error.message);
  }

  // Test 4: Close the poll
  console.log("\n🚫 Test 4: Closing the poll");
  try {
    const closeResponse = await closePoll(createdPollId);
    if (closeResponse.error) {
      console.error("❌ Failed to close poll:", closeResponse.error);
    } else {
      console.log("✅ Poll closed successfully, status:", closeResponse.status);
    }
  } catch (error) {
    console.error("❌ Exception:", error.message);
  }

  // Test 5: Delete the poll
  console.log("\n🗑️ Test 5: Deleting the poll");
  try {
    const deleteResponse = await deletePoll(createdPollId);
    if (deleteResponse.error) {
      console.error("❌ Failed to delete poll:", deleteResponse.error);
    } else {
      console.log("✅ Poll deleted successfully");
    }
  } catch (error) {
    console.error("❌ Exception:", error.message);
  }

  console.log("\n--------------------------------------");
  console.log("🏁 Poll API Integration Tests Completed");
}

// Run the tests (uncomment to execute)
// runTests();

export default runTests; 