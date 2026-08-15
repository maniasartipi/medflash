---
name: adversarial-flashcards
description: >-
  Use this skill to autonomously generate new medical flashcards from a lecture text using a two-agent adversarial approach. Trigger this when the user asks to generate or expand flashcards from a lecture or PDF.
---

# Adversarial Flashcard Generation Workflow

This skill orchestrates a two-agent adversarial loop to ensure 100% comprehensive coverage of a lecture's text. 

## Workflow Instructions

1. **Preparation:**
   - Ensure the lecture text is available (extract it from PDF if necessary).
   - Divide the lecture text into manageable **sections or chunks** to avoid hitting context limits.
   - Load the existing flashcards array from the respective JSON file (e.g., `src/data/courses/<courseId>/<lectureId>.json`). If none exists, start with an empty array `[]`.

2. **The Adversarial Loop (Iterate per chunk):**
   For each chunk of text, repeat the following loop until the Exam Designer yields:

   ### Step 2a: Invoke the Exam Designer
   Spawn an `Exam Designer` subagent (using `invoke_subagent` or `send_message`). 
   **Prompt for the Exam Designer:**
   > You are a ruthless Exam Designer. Your goal is to find a piece of information, no matter how obscure or trivial, in the provided lecture text that a student could NOT answer if they only studied the provided flashcards.
   > 
   > **Inputs:**
   > - Lecture Text Chunk: [Insert Chunk]
   > - Current Flashcards: [Insert Flashcards Array]
   > 
   > **Task:** If you can find a missing detail, formulate a direct question that tests it. If absolutely 100% of the text is covered by the current flashcards, output exactly the word `ALL_COVERED`.

   ### Step 2b: Evaluate Designer Response
   - If the Exam Designer outputs `ALL_COVERED`, the chunk is fully mastered. Break the loop and move to the next text chunk.
   - If the Exam Designer outputs a question, proceed to Step 2c.

   ### Step 2c: Invoke the Medical Expert Teacher
   Spawn a `Medical Expert` subagent.
   **Prompt for the Teacher:**
   > You are an expert medical instructor. The Exam Designer has found a gap in our flashcards and asked the following question: "[Insert Question]"
   > 
   > **Inputs:**
   > - Lecture Text Chunk: [Insert Chunk]
   > 
   > **Task:** Create a flashcard based on the lecture text that answers this question perfectly. 
   > You must output **ONLY strict JSON** without any conversational text or markdown formatting. The JSON must follow this exact schema:
   > ```json
   > {
   >   "id": "c-unique_id",
   >   "cat": "Relevant Category from text",
   >   "f": "The formulated question",
   >   "b": "The concise answer based on the text"
   > }
   > ```

   ### Step 2d: Append & Repeat
   - Parse the JSON output from the Teacher.
   - Append the new flashcard object to the current flashcards array.
   - Repeat from Step 2a (providing the updated flashcards array to the Exam Designer) until `ALL_COVERED` is achieved.

3. **Finalization:**
   - Once all chunks are processed, overwrite the specific lecture JSON file (e.g., `src/data/courses/<courseId>/<lectureId>.json`) with the final complete array of flashcards.
   - Do not forget to update the `creators` and `editor` fields in the course `index.json` if requested by the user.
