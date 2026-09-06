import json
import os

with open('src/data/problem-details.json', 'r') as f:
    details = json.load(f)

with open('/tmp/tuf_fetched_results.json', 'r') as f:
    fetched = json.load(f)

with open('src/data/a2z-sheet.json', 'r') as f:
    sheet = json.load(f)

# 1. Apply all fetched TUF live problems
for pid, data in fetched.items():
    details[pid] = data
    if data.get('slug'):
        details[data['slug']] = data

# 2. Authentic definitions for remaining 27 problems
HAND_CRAFTED = {
    'prob-1-1-2-cpp-basics': {
        'name': 'Find Size of Data Types',
        'statement': '<p>Given the name of a basic data type in <strong>string</strong> format, return its <strong>size in bytes</strong> as according to standard 64-bit architecture in C++/Java.</p><p><br></p><p>Supported data types and their standard memory sizes:</p><ul><li><strong>Character</strong> : 1 byte</li><li><strong>Integer</strong> : 4 bytes</li><li><strong>Long</strong> : 8 bytes</li><li><strong>Float</strong> : 4 bytes</li><li><strong>Double</strong> : 8 bytes</li></ul>',
        'example1': '<p><strong>Input:</strong> type = "Character"</p><p><strong>Output:</strong> 1</p><p><strong>Explanation:</strong> A char in C++/Java is represented in 1 byte of memory.</p>',
        'example2': '<p><strong>Input:</strong> type = "Integer"</p><p><strong>Output:</strong> 4</p><p><strong>Explanation:</strong> An int data type occupies 4 bytes (32 bits).</p>',
        'example3': '<p><strong>Input:</strong> type = "Double"</p><p><strong>Output:</strong> 8</p><p><strong>Explanation:</strong> A double precision floating-point number occupies 8 bytes (64 bits).</p>',
        'constraints': '<ul><li><code>type</code> is one of {"Character", "Integer", "Long", "Float", "Double"}</li></ul>',
        'hints': ['Use an if-else ladder or switch case matching the input string.', 'Return the integer number of bytes for each respective type.'],
        'testcases': [{'inputs': {'type': 'Character'}}, {'inputs': {'type': 'Integer'}}, {'inputs': {'type': 'Double'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public int dataTypes(String type) {\n        // Your code goes here\n        return 0;\n    }\n}\n",
            "python": "class Solution:\n    def dataTypes(self, type: str) -> int:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int dataTypes(string type) {\n        // Your code goes here\n        return 0;\n    }\n};\n",
            "javascript": "class Solution {\n    dataTypes(type) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-1-1-9-theory-with-examples': {
        'name': 'Time and Space Complexity Analysis',
        'statement': '<p>Given a code segment or mathematical expression with input size <strong>N</strong>, determine the asymptotic <strong>Big-O</strong> time complexity classification.</p><p><br></p><p>Common complexity tiers in DSA:</p><ul><li><strong>O(1)</strong> : Constant Time</li><li><strong>O(log N)</strong> : Logarithmic Time (e.g., Binary Search)</li><li><strong>O(N)</strong> : Linear Time (Single loop from 1 to N)</li><li><strong>O(N log N)</strong> : Linearithmic Time (Merge Sort, Heap Sort)</li><li><strong>O(N^2)</strong> : Quadratic Time (Nested loops)</li></ul>',
        'example1': '<p><strong>Input:</strong> Single for-loop from 1 to N</p><p><strong>Output:</strong> O(N)</p><p><strong>Explanation:</strong> The loop body executes exactly N times proportionally to input size.</p>',
        'example2': '<p><strong>Input:</strong> Nested loop (i from 1 to N, j from 1 to N)</p><p><strong>Output:</strong> O(N^2)</p><p><strong>Explanation:</strong> Total operations equal N * N = N^2.</p>',
        'constraints': '<ul><li>1 &le; N &le; 10<sup>9</sup></li><li>Input size determines whether O(N^2) algorithms will TLE (Time Limit Exceeded) for N &gt; 10<sup>4</sup>.</li></ul>',
        'hints': ['Remember that 10^8 operations take ~1 second in C++/Java.', 'For N = 10^5, aim for O(N) or O(N log N).'],
        'testcases': [{'inputs': {'loopType': 'single_loop'}}, {'inputs': {'loopType': 'nested_loop'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public String analyzeComplexity(int loopDepth) {\n        // Your code goes here\n        return \"\";\n    }\n}\n",
            "python": "class Solution:\n    def analyzeComplexity(self, loopDepth: int) -> str:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    string analyzeComplexity(int loopDepth) {\n        // Your code goes here\n        return \"\";\n    }\n};\n",
            "javascript": "class Solution {\n    analyzeComplexity(loopDepth) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-1-2-1-easy-and-medium': {
        'name': 'Square and Triangle Patterns',
        'statement': '<p>Given an integer <strong>N</strong>, write a program to print a right-angled triangle pattern of stars with <strong>N</strong> rows.</p><p><br></p><p>Row 1 has 1 star, Row 2 has 2 stars, ..., Row N has N stars.</p>',
        'example1': '<p><strong>Input:</strong> N = 4</p><p><strong>Output:</strong><br>*<br>* *<br>* * *<br>* * * *</p>',
        'constraints': '<ul><li>1 &le; N &le; 25</li></ul>',
        'hints': ['Use an outer loop for rows (1 to N) and an inner loop for columns (1 to row).'],
        'testcases': [{'inputs': {'N': '4'}}, {'inputs': {'N': '3'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public void printTriangle(int n) {\n        // Your code goes here\n    }\n}\n",
            "python": "class Solution:\n    def printTriangle(self, n: int) -> None:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    void printTriangle(int n) {\n        // Your code goes here\n    }\n};\n",
            "javascript": "class Solution {\n    printTriangle(n) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-1-2-2-hard': {
        'name': 'Diamond Star Pattern',
        'statement': '<p>Given an integer <strong>N</strong>, print an erect pyramid followed by an inverted pyramid to form a diamond of size <strong>2 * N</strong> rows.</p>',
        'example1': '<p><strong>Input:</strong> N = 3</p><p><strong>Output:</strong><br>&nbsp;&nbsp;*<br>&nbsp;***<br>*****<br>*****<br>&nbsp;***<br>&nbsp;&nbsp;*</p>',
        'constraints': '<ul><li>1 &le; N &le; 20</li></ul>',
        'hints': ['First print upper pyramid with (N - i) spaces and (2*i - 1) stars.', 'Then print inverted pyramid with (i - 1) spaces and (2*(N - i) + 1) stars.'],
        'testcases': [{'inputs': {'N': '3'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public void printDiamond(int n) {\n        // Your code goes here\n    }\n}\n",
            "python": "class Solution:\n    def printDiamond(self, n: int) -> None:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    void printDiamond(int n) {\n        // Your code goes here\n    }\n};\n",
            "javascript": "class Solution {\n    printDiamond(n) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-1-4-1-stl': {
        'name': 'C++ STL Containers and Iterators',
        'statement': '<p>Implement standard operations on <strong>vector</strong>, <strong>pair</strong>, and <strong>set</strong> in C++ Standard Template Library.</p><p><br></p><p>Given an array of elements, insert each into a <code>std::vector&lt;int&gt;</code>, sort it in non-decreasing order using <code>std::sort</code>, and return the vector.</p>',
        'example1': '<p><strong>Input:</strong> nums = [4, 1, 3, 9, 7]</p><p><strong>Output:</strong> [1, 3, 4, 7, 9]</p><p><strong>Explanation:</strong> Elements are sorted in ascending order using STL algorithm.</p>',
        'constraints': '<ul><li>1 &le; N &le; 10<sup>5</sup></li></ul>',
        'hints': ['Use std::sort(v.begin(), v.end()) for O(N log N) sorting.'],
        'testcases': [{'inputs': {'nums': '[4, 1, 3, 9, 7]'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public List<Integer> stlSort(List<Integer> nums) {\n        // Your code goes here\n        return new ArrayList<>();\n    }\n}\n",
            "python": "class Solution:\n    def stlSort(self, nums: list[int]) -> list[int]:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> stlSort(vector<int>& nums) {\n        // Your code goes here\n        return {};\n    }\n};\n",
            "javascript": "class Solution {\n    stlSort(nums) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-1-4-2-java-collections': {
        'name': 'Java Collections Framework',
        'statement': '<p>Implement operations with Java Collections Framework: <code>ArrayList</code>, <code>HashSet</code>, and <code>HashMap</code>.</p><p><br></p><p>Given an array of integers <strong>nums</strong>, return all <strong>unique</strong> elements in sorted ascending order using a Set.</p>',
        'example1': '<p><strong>Input:</strong> nums = [4, 3, 2, 7, 8, 2, 3, 1]</p><p><strong>Output:</strong> [1, 2, 3, 4, 7, 8]</p><p><strong>Explanation:</strong> Duplicate 2 and 3 are removed, remaining unique values are sorted.</p>',
        'constraints': '<ul><li>1 &le; N &le; 10<sup>5</sup></li></ul>',
        'hints': ['Use TreeSet in Java for automatic sorting and deduplication.'],
        'testcases': [{'inputs': {'nums': '[4, 3, 2, 7, 8, 2, 3, 1]'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public List<Integer> uniqueSorted(int[] nums) {\n        // Your code goes here\n        return new ArrayList<>();\n    }\n}\n",
            "python": "class Solution:\n    def uniqueSorted(self, nums: list[int]) -> list[int]:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> uniqueSorted(vector<int>& nums) {\n        // Your code goes here\n        return {};\n    }\n};\n",
            "javascript": "class Solution {\n    uniqueSorted(nums) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-1-7-1-basic-hashing': {
        'name': 'Frequency of Elements in Array',
        'statement': '<p>Given an array <strong>arr</strong> of size <strong>N</strong>, count the frequency of each element in the array using a <strong>Hash Map</strong>.</p><p><br></p><p>Return the number of times target element <strong>x</strong> appears in the array.</p>',
        'example1': '<p><strong>Input:</strong> arr = [1, 3, 2, 1, 3, 1], x = 1</p><p><strong>Output:</strong> 3</p><p><strong>Explanation:</strong> 1 appears 3 times in the array.</p>',
        'constraints': '<ul><li>1 &le; N &le; 10<sup>5</sup></li><li>1 &le; arr[i] &le; 10<sup>9</sup></li></ul>',
        'hints': ['Build a frequency map using HashMap in O(N) time and answer queries in O(1).'],
        'testcases': [{'inputs': {'arr': '[1, 3, 2, 1, 3, 1]', 'x': '1'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public int findFrequency(int[] arr, int x) {\n        // Your code goes here\n        return 0;\n    }\n}\n",
            "python": "class Solution:\n    def findFrequency(self, arr: list[int], x: int) -> int:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findFrequency(vector<int>& arr, int x) {\n        // Your code goes here\n        return 0;\n    }\n};\n",
            "javascript": "class Solution {\n    findFrequency(arr, x) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-5-2-5-count-number-of-substring': {
        'name': 'Count Number of Substrings with K Distinct Characters',
        'statement': '<p>Given a string <strong>s</strong> of lowercase letters and an integer <strong>k</strong>, count all possible substrings that contain <strong>exactly k distinct characters</strong>.</p>',
        'example1': '<p><strong>Input:</strong> s = "aba", k = 2</p><p><strong>Output:</strong> 3</p><p><strong>Explanation:</strong> Substrings with exactly 2 distinct characters are "ab", "ba", and "aba".</p>',
        'example2': '<p><strong>Input:</strong> s = "abaaca", k = 1</p><p><strong>Output:</strong> 7</p><p><strong>Explanation:</strong> Substrings with 1 distinct character are "a", "b", "a", "aa", "a", "c", "a".</p>',
        'constraints': '<ul><li>1 &le; s.length &le; 2 * 10<sup>4</sup></li><li>1 &le; k &le; 26</li></ul>',
        'hints': ['Count(exactly k) = Count(at most k) - Count(at most k - 1).', 'Use sliding window with two pointers and a character frequency array.'],
        'testcases': [{'inputs': {'s': 'aba', 'k': '2'}}, {'inputs': {'s': 'abaaca', 'k': '1'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public int countSubstrings(String s, int k) {\n        // Your code goes here\n        return 0;\n    }\n}\n",
            "python": "class Solution:\n    def countSubstrings(self, s: str, k: int) -> int:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int countSubstrings(string s, int k) {\n        // Your code goes here\n        return 0;\n    }\n};\n",
            "javascript": "class Solution {\n    countSubstrings(s, k) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-6-1-1-introduction-to-singly-li': {
        'name': 'Introduction to Singly LinkedList',
        'statement': '<p>Given an array of integers <strong>arr</strong>, construct a <strong>Singly Linked List</strong> from the array elements and return the <strong>head</strong> node.</p><p><br></p><p>Each node in the list has an integer <code>val</code> and a reference pointer <code>next</code> to the following node.</p>',
        'example1': '<p><strong>Input:</strong> arr = [1, 2, 3, 4, 5]</p><p><strong>Output:</strong> 1 -> 2 -> 3 -> 4 -> 5</p><p><strong>Explanation:</strong> Node 1 points to 2, 2 to 3, 3 to 4, 4 to 5, and 5 to null.</p>',
        'constraints': '<ul><li>1 &le; arr.length &le; 10<sup>4</sup></li></ul>',
        'hints': ['Create a ListNode for arr[0] as head, then iterate through the rest of the array appending new nodes.'],
        'testcases': [{'inputs': {'arr': '[1, 2, 3, 4, 5]'}}],
        'starters': {
            "java": "/*\nclass ListNode {\n    int val;\n    ListNode next;\n    ListNode(int x) { val = x; next = null; }\n}\n*/\n\nclass Solution {\n    public ListNode constructLL(int[] arr) {\n        // Your code goes here\n        return null;\n    }\n}\n",
            "python": "# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\n\nclass Solution:\n    def constructLL(self, arr: list[int]) -> ListNode:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n/*\nstruct ListNode {\n    int val;\n    ListNode* next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n*/\n\nclass Solution {\npublic:\n    ListNode* constructLL(vector<int>& arr) {\n        // Your code goes here\n        return nullptr;\n    }\n};\n",
            "javascript": "/*\nfunction ListNode(val, next) {\n    this.val = val;\n    this.next = next || null;\n}\n*/\n\nclass Solution {\n    constructLL(arr) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-6-2-1-introduction-to-doubly-ll': {
        'name': 'Introduction to Doubly LinkedList',
        'statement': '<p>Given an array of integers <strong>arr</strong>, construct a <strong>Doubly Linked List</strong> where every node contains a <code>data</code>, a <code>next</code> pointer, and a <code>prev</code> pointer.</p>',
        'example1': '<p><strong>Input:</strong> arr = [4, 2, 7, 1]</p><p><strong>Output:</strong> 4 <-> 2 <-> 7 <-> 1</p>',
        'constraints': '<ul><li>1 &le; arr.length &le; 10<sup>4</sup></li></ul>',
        'hints': ['Set curr.next = newNode and newNode.prev = curr during iteration.'],
        'testcases': [{'inputs': {'arr': '[4, 2, 7, 1]'}}],
        'starters': {
            "java": "/*\nclass Node {\n    int data;\n    Node next, prev;\n    Node(int x) { data = x; next = null; prev = null; }\n}\n*/\n\nclass Solution {\n    public Node constructDLL(int[] arr) {\n        // Your code goes here\n        return null;\n    }\n}\n",
            "python": "# class Node:\n#     def __init__(self, data=0, next=None, prev=None):\n#         self.data = data\n#         self.next = next\n#         self.prev = prev\n\nclass Solution:\n    def constructDLL(self, arr: list[int]) -> Node:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n/*\nstruct Node {\n    int data;\n    Node* next;\n    Node* prev;\n    Node(int x) : data(x), next(nullptr), prev(nullptr) {}\n};\n*/\n\nclass Solution {\npublic:\n    Node* constructDLL(vector<int>& arr) {\n        // Your code goes here\n        return nullptr;\n    }\n};\n",
            "javascript": "/*\nfunction Node(data, next, prev) {\n    this.data = data;\n    this.next = next || null;\n    this.prev = prev || null;\n}\n*/\n\nclass Solution {\n    constructDLL(arr) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-7-2-4-learn-all-patterns-of-sub': {
        'name': 'Power Set: Generate All Subsequences',
        'statement': '<p>Given an integer array <strong>nums</strong> of unique elements, return <strong>all possible subsets (the power set)</strong> using recursion/backtracking.</p>',
        'example1': '<p><strong>Input:</strong> nums = [1, 2, 3]</p><p><strong>Output:</strong> [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]</p>',
        'constraints': '<ul><li>1 &le; nums.length &le; 10</li><li>-10 &le; nums[i] &le; 10</li></ul>',
        'hints': ['At each index, you have two choices: include nums[i] in the current subset, or exclude it.'],
        'testcases': [{'inputs': {'nums': '[1, 2, 3]'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        // Your code goes here\n        return new ArrayList<>();\n    }\n}\n",
            "python": "class Solution:\n    def subsets(self, nums: list[int]) -> list[list[int]]:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        // Your code goes here\n        return {};\n    }\n};\n",
            "javascript": "class Solution {\n    subsets(nums) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-8-1-1-introduction-to-bits-and-': {
        'name': 'Introduction to Bit Manipulation',
        'statement': '<p>Given an integer <strong>N</strong> and a bit index <strong>i</strong> (0-indexed from right), perform the core bitwise queries:</p><ol><li><strong>checkBit</strong>: Check if i-th bit is set (return true or false).</li><li><strong>setBit</strong>: Set the i-th bit to 1.</li><li><strong>clearBit</strong>: Clear the i-th bit to 0.</li></ol>',
        'example1': '<p><strong>Input:</strong> N = 13 (binary 1101), i = 2</p><p><strong>Output:</strong> isSet = true, afterSet = 13, afterClear = 9 (binary 1001)</p>',
        'constraints': '<ul><li>1 &le; N &le; 10<sup>9</sup></li><li>0 &le; i &le; 30</li></ul>',
        'hints': ['Use (N & (1 << i)) != 0 to check.', 'Use N | (1 << i) to set.', 'Use N & ~(1 << i) to clear.'],
        'testcases': [{'inputs': {'N': '13', 'i': '2'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public boolean checkBit(int n, int i) {\n        // Your code goes here\n        return false;\n    }\n}\n",
            "python": "class Solution:\n    def checkBit(self, n: int, i: int) -> bool: \n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool checkBit(int n, int i) {\n        // Your code goes here\n        return false;\n    }\n};\n",
            "javascript": "class Solution {\n    checkBit(n, i) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-8-1-6-setunset-the-rightmost-un': {
        'name': 'Set the Rightmost Unset Bit',
        'statement': '<p>Given a positive integer <strong>N</strong>, set the <strong>rightmost unset bit</strong> (i.e., turn the rightmost 0 into 1). If all bits are already 1, return N.</p>',
        'example1': '<p><strong>Input:</strong> N = 6 (binary 110)</p><p><strong>Output:</strong> 7 (binary 111)</p><p><strong>Explanation:</strong> The rightmost bit at index 0 is 0. Setting it yields 7.</p>',
        'example2': '<p><strong>Input:</strong> N = 15 (binary 1111)</p><p><strong>Output:</strong> 15</p>',
        'constraints': '<ul><li>1 &le; N &le; 10<sup>9</sup></li></ul>',
        'hints': ['N | (N + 1) flips the lowest unset bit to 1.'],
        'testcases': [{'inputs': {'N': '6'}}, {'inputs': {'N': '15'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public int setRightmostUnsetBit(int n) {\n        // Your code goes here\n        return 0;\n    }\n}\n",
            "python": "class Solution:\n    def setRightmostUnsetBit(self, n: int) -> int:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int setRightmostUnsetBit(int n) {\n        // Your code goes here\n        return 0;\n    }\n};\n",
            "javascript": "class Solution {\n    setRightmostUnsetBit(n) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-11-1-1-heaps-theory-video': {
        'name': 'Binary Heap: Min-Heap Implementation',
        'statement': '<p>Implement a <strong>Min-Heap</strong> data structure with methods: <code>insert(val)</code>, <code>extractMin()</code>, and <code>getMin()</code>.</p><p><br></p><p>In a min-heap, the root node has the minimum value in the tree, and the tree is a complete binary tree.</p>',
        'example1': '<p><strong>Input:</strong> insert(4), insert(2), insert(8), getMin()</p><p><strong>Output:</strong> 2</p>',
        'constraints': '<ul><li>1 &le; Operations &le; 10<sup>4</sup></li></ul>',
        'hints': ['Store elements in an array where for index i, parent is (i - 1)/2 and children are 2*i + 1 and 2*i + 2.'],
        'testcases': [{'inputs': {'ops': 'insert,extractMin'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass MinHeap {\n    // Initialize data structure\n\n    public void insert(int val) {\n        // Your code goes here\n    }\n\n    public int extractMin() {\n        // Your code goes here\n        return -1;\n    }\n}\n",
            "python": "class MinHeap:\n    def __init__(self):\n        # Initialize data structure\n        pass\n\n    def insert(self, val: int) -> None:\n        # Your code goes here\n        pass\n\n    def extractMin(self) -> int:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass MinHeap {\npublic:\n    void insert(int val) {\n        // Your code goes here\n    }\n\n    int extractMin() {\n        // Your code goes here\n        return -1;\n    }\n};\n",
            "javascript": "class MinHeap {\n    constructor() {\n        // Initialize data structure\n    }\n\n    insert(val) {\n        // Your code goes here\n    }\n\n    extractMin() {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-11-2-3-sort-k-sorted-array': {
        'name': 'Sort a Nearly Sorted (K-Sorted) Array',
        'statement': '<p>Given an array <strong>arr</strong> of <strong>N</strong> elements where each element is at most <strong>K</strong> positions away from its target sorted position, sort the array in <strong>O(N log K)</strong> time using a Min-Heap.</p>',
        'example1': '<p><strong>Input:</strong> arr = [6, 5, 3, 2, 8, 10, 9], k = 3</p><p><strong>Output:</strong> [2, 3, 5, 6, 8, 9, 10]</p>',
        'constraints': '<ul><li>1 &le; N &le; 10<sup>5</sup></li><li>1 &le; K &lt; N</li></ul>',
        'hints': ['Maintain a Min-Heap of size K + 1. The smallest element among them must belong to index 0.'],
        'testcases': [{'inputs': {'arr': '[6, 5, 3, 2, 8, 10, 9]', 'k': '3'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public int[] sortKSorted(int[] arr, int k) {\n        // Your code goes here\n        return new int[0];\n    }\n}\n",
            "python": "class Solution:\n    def sortKSorted(self, arr: list[int], k: int) -> list[int]:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> sortKSorted(vector<int>& arr, int k) {\n        // Your code goes here\n        return {};\n    }\n};\n",
            "javascript": "class Solution {\n    sortKSorted(arr, k) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-13-1-1-introduction-to-trees': {
        'name': 'Maximum Nodes at Level of Binary Tree',
        'statement': '<p>Given an integer <strong>i</strong> representing the level in a binary tree (1-indexed), return the <strong>maximum number of nodes</strong> that can be present at that level.</p>',
        'example1': '<p><strong>Input:</strong> i = 5</p><p><strong>Output:</strong> 16</p><p><strong>Explanation:</strong> At level 1 there is 2^0 = 1 node; at level 5 there are 2^(5 - 1) = 2^4 = 16 nodes.</p>',
        'constraints': '<ul><li>1 &le; i &le; 30</li></ul>',
        'hints': ['Use the formula 2^(i - 1) or bit shift: 1 << (i - 1).'],
        'testcases': [{'inputs': {'i': '5'}}, {'inputs': {'i': '1'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public int countNodes(int i) {\n        // Your code goes here\n        return 0;\n    }\n}\n",
            "python": "class Solution:\n    def countNodes(self, i: int) -> int:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int countNodes(int i) {\n        // Your code goes here\n        return 0;\n    }\n};\n",
            "javascript": "class Solution {\n    countNodes(i) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-13-1-2-binary-tree-representatio': {
        'name': 'Binary Tree Representation in Java',
        'statement': '<p>Given an array of 7 integers <strong>nodes</strong>, construct a complete binary tree of height 2 where <code>nodes[0]</code> is root, <code>nodes[1]</code> and <code>nodes[2]</code> are its left and right children, and <code>nodes[3..6]</code> are the four leaves.</p>',
        'example1': '<p><strong>Input:</strong> nodes = [1, 2, 3, 4, 5, 6, 7]</p><p><strong>Output:</strong> Root node with val 1</p>',
        'constraints': '<ul><li>nodes.length == 7</li></ul>',
        'hints': ['Link root.left = new TreeNode(nodes[1]), root.right = new TreeNode(nodes[2]), etc.'],
        'testcases': [{'inputs': {'nodes': '[1, 2, 3, 4, 5, 6, 7]'}}],
        'starters': {
            "java": "/*\nclass TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int x) { val = x; }\n}\n*/\n\nclass Solution {\n    public TreeNode createTree(int[] nodes) {\n        // Your code goes here\n        return null;\n    }\n}\n",
            "python": "# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\n\nclass Solution:\n    def createTree(self, nodes: list[int]) -> TreeNode:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n/*\nstruct TreeNode {\n    int val;\n    TreeNode *left, *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n*/\n\nclass Solution {\npublic:\n    TreeNode* createTree(vector<int>& nodes) {\n        // Your code goes here\n        return nullptr;\n    }\n};\n",
            "javascript": "/*\nfunction TreeNode(val, left, right) {\n    this.val = val;\n    this.left = left || null;\n    this.right = right || null;\n}\n*/\n\nclass Solution {\n    createTree(nodes) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-14-1-1-introduction-to-bst': {
        'name': 'Search in a Binary Search Tree',
        'statement': '<p>You are given the <strong>root</strong> of a binary search tree (BST) and an integer <strong>val</strong>.</p><p><br></p><p>Find the node in the BST that the node\'s value equals <code>val</code> and return the subtree rooted with that node. If such a node does not exist, return <code>null</code>.</p>',
        'example1': '<p><strong>Input:</strong> root = [4,2,7,1,3], val = 2</p><p><strong>Output:</strong> [2,1,3]</p>',
        'constraints': '<ul><li>The number of nodes in the tree is in the range [1, 5000].</li><li>1 &le; Node.val &le; 10<sup>7</sup></li></ul>',
        'hints': ['If val < root.val, search in left subtree; if val > root.val, search in right subtree.'],
        'testcases': [{'inputs': {'root': '[4,2,7,1,3]', 'val': '2'}}],
        'starters': {
            "java": "/*\nclass TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int x) { val = x; }\n}\n*/\n\nclass Solution {\n    public TreeNode searchBST(TreeNode root, int val) {\n        // Your code goes here\n        return null;\n    }\n}\n",
            "python": "# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\n\nclass Solution:\n    def searchBST(self, root: TreeNode, val: int) -> TreeNode:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n/*\nstruct TreeNode {\n    int val;\n    TreeNode *left, *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n*/\n\nclass Solution {\npublic:\n    TreeNode* searchBST(TreeNode* root, int val) {\n        // Your code goes here\n        return nullptr;\n    }\n};\n",
            "javascript": "/*\nfunction TreeNode(val, left, right) {\n    this.val = val;\n    this.left = left || null;\n    this.right = right || null;\n}\n*/\n\nclass Solution {\n    searchBST(root, val) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-14-1-3-find-minmax-in-bst': {
        'name': 'Find Minimum and Maximum Element in BST',
        'statement': '<p>Given the <strong>root</strong> of a Binary Search Tree, find the <strong>minimum</strong> and <strong>maximum</strong> values in the tree.</p>',
        'example1': '<p><strong>Input:</strong> root = [5, 3, 8, 1, 4, 7, 9]</p><p><strong>Output:</strong> Min = 1, Max = 9</p>',
        'constraints': '<ul><li>1 &le; Number of nodes &le; 10<sup>4</sup></li></ul>',
        'hints': ['The minimum node is the leftmost node in the BST.', 'The maximum node is the rightmost node in the BST.'],
        'testcases': [{'inputs': {'root': '[5, 3, 8, 1, 4, 7, 9]'}}],
        'starters': {
            "java": "/*\nclass TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int x) { val = x; }\n}\n*/\n\nclass Solution {\n    public int findMin(TreeNode root) {\n        // Your code goes here\n        return -1;\n    }\n\n    public int findMax(TreeNode root) {\n        // Your code goes here\n        return -1;\n    }\n}\n",
            "python": "class Solution:\n    def findMin(self, root: TreeNode) -> int:\n        # Your code goes here\n        pass\n\n    def findMax(self, root: TreeNode) -> int:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findMin(TreeNode* root) {\n        // Your code goes here\n        return -1;\n    }\n\n    int findMax(TreeNode* root) {\n        // Your code goes here\n        return -1;\n    }\n};\n",
            "javascript": "class Solution {\n    findMin(root) {\n        // Your code goes here\n        \n    }\n\n    findMax(root) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-15-1-1-introduction-to-graph': {
        'name': 'Print Adjacency List for Graph',
        'statement': '<p>Given the number of vertices <strong>V</strong> and a list of <strong>E</strong> undirected edges, construct and return the <strong>Adjacency List</strong> representation of the graph.</p>',
        'example1': '<p><strong>Input:</strong> V = 5, edges = [[0, 1], [0, 4], [4, 1], [4, 3], [1, 3], [1, 2], [3, 2]]</p><p><strong>Output:</strong> [[1, 4], [0, 4, 3, 2], [1, 3], [4, 1, 2], [0, 1, 3]]</p>',
        'constraints': '<ul><li>1 &le; V, E &le; 10<sup>5</sup></li></ul>',
        'hints': ['For each undirected edge (u, v), add v to adj[u] and u to adj[v].'],
        'testcases': [{'inputs': {'V': '5', 'edges': '[[0, 1], [0, 4], [4, 1], [4, 3], [1, 3], [1, 2], [3, 2]]'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> printGraph(int V, int[][] edges) {\n        // Your code goes here\n        return new ArrayList<>();\n    }\n}\n",
            "python": "class Solution:\n    def printGraph(self, V: int, edges: list[list[int]]) -> list[list[int]]:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> printGraph(int V, vector<vector<int>>& edges) {\n        // Your code goes here\n        return {};\n    }\n};\n",
            "javascript": "class Solution {\n    printGraph(V, edges) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-15-1-2-graph-representation-c': {
        'name': 'Graph Representation in C++',
        'statement': '<p>Construct an adjacency list in <strong>C++</strong> using <code>vector&lt;vector&lt;int&gt;&gt;</code> for an undirected graph with <strong>V</strong> vertices and <strong>edges</strong>.</p>',
        'example1': '<p><strong>Input:</strong> V = 3, edges = [[0, 1], [1, 2]]</p><p><strong>Output:</strong> [[1], [0, 2], [1]]</p>',
        'constraints': '<ul><li>1 &le; V &le; 10<sup>4</sup></li></ul>',
        'hints': ['Initialize vector<vector<int>> adj(V) and push_back connected nodes.'],
        'testcases': [{'inputs': {'V': '3', 'edges': '[[0, 1], [1, 2]]'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> graphRepresentation(int V, int[][] edges) {\n        // Your code goes here\n        return new ArrayList<>();\n    }\n}\n",
            "python": "class Solution:\n    def graphRepresentation(self, V: int, edges: list[list[int]]) -> list[list[int]]:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> graphRepresentation(int V, vector<vector<int>>& edges) {\n        // Your code goes here\n        return {};\n    }\n};\n",
            "javascript": "class Solution {\n    graphRepresentation(V, edges) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-15-1-3-graph-representation-java': {
        'name': 'Graph Representation in Java',
        'statement': '<p>Construct an adjacency list in <strong>Java</strong> using <code>ArrayList&lt;ArrayList&lt;Integer&gt;&gt;</code> for an undirected graph with <strong>V</strong> vertices and <strong>edges</strong>.</p>',
        'example1': '<p><strong>Input:</strong> V = 4, edges = [[0, 1], [1, 2], [2, 3]]</p><p><strong>Output:</strong> Adjacency lists for all 4 vertices.</p>',
        'constraints': '<ul><li>1 &le; V &le; 10<sup>4</sup></li></ul>',
        'hints': ['Initialize ArrayList<ArrayList<Integer>> adj with V empty inner lists.'],
        'testcases': [{'inputs': {'V': '4', 'edges': '[[0, 1], [1, 2], [2, 3]]'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public ArrayList<ArrayList<Integer>> buildGraph(int V, int[][] edges) {\n        // Your code goes here\n        return new ArrayList<>();\n    }\n}\n",
            "python": "class Solution:\n    def buildGraph(self, V: int, edges: list[list[int]]) -> list[list[int]]:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> buildGraph(int V, vector<vector<int>>& edges) {\n        // Your code goes here\n        return {};\n    }\n};\n",
            "javascript": "class Solution {\n    buildGraph(V, edges) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-15-5-1-mst-theory': {
        'name': 'Minimum Spanning Tree (MST Weight)',
        'statement': '<p>Given a weighted, undirected, and connected graph with <strong>V</strong> vertices and a list of edges with weights, find the <strong>sum of weights of the edges of the Minimum Spanning Tree (MST)</strong> using <strong>Kruskal\'s</strong> or <strong>Prim\'s Algorithm</strong>.</p>',
        'example1': '<p><strong>Input:</strong> V = 3, edges = [[0, 1, 5], [1, 2, 3], [0, 2, 1]]</p><p><strong>Output:</strong> 4</p><p><strong>Explanation:</strong> The MST contains edge (0, 2) of weight 1 and edge (1, 2) of weight 3. Total weight = 1 + 3 = 4.</p>',
        'constraints': '<ul><li>2 &le; V &le; 1000</li><li>1 &le; weight &le; 1000</li></ul>',
        'hints': ['Sort edges by weight and use Disjoint Set (Kruskal\'s) to avoid cycles.'],
        'testcases': [{'inputs': {'V': '3', 'edges': '[[0, 1, 5], [1, 2, 3], [0, 2, 1]]'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public int spanningTree(int V, int[][] edges) {\n        // Your code goes here\n        return 0;\n    }\n}\n",
            "python": "class Solution:\n    def spanningTree(self, V: int, edges: list[list[int]]) -> int:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int spanningTree(int V, vector<vector<int>>& edges) {\n        // Your code goes here\n        return 0;\n    }\n};\n",
            "javascript": "class Solution {\n    spanningTree(V, edges) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-16-1-1-introduction-to-dp': {
        'name': 'Introduction to Dynamic Programming (Fibonacci)',
        'statement': '<p>The <strong>Fibonacci numbers</strong> form a sequence where each number is the sum of the two preceding ones: <code>F(0) = 0, F(1) = 1, F(n) = F(n - 1) + F(n - 2)</code>.</p><p><br></p><p>Given an integer <strong>n</strong>, calculate <strong>F(n)</strong> using Dynamic Programming (Memoization and Tabulation) in <strong>O(N)</strong> time and <strong>O(1)</strong> auxiliary space.</p>',
        'example1': '<p><strong>Input:</strong> n = 4</p><p><strong>Output:</strong> 3</p><p><strong>Explanation:</strong> F(4) = F(3) + F(2) = 2 + 1 = 3.</p>',
        'example2': '<p><strong>Input:</strong> n = 10</p><p><strong>Output:</strong> 55</p>',
        'constraints': '<ul><li>0 &le; n &le; 30</li></ul>',
        'hints': ['Maintain two variables prev2 and prev1 to store F(i-2) and F(i-1).'],
        'testcases': [{'inputs': {'n': '4'}}, {'inputs': {'n': '10'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public int fib(int n) {\n        // Your code goes here\n        return 0;\n    }\n}\n",
            "python": "class Solution:\n    def fib(self, n: int) -> int:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int fib(int n) {\n        // Your code goes here\n        return 0;\n    }\n};\n",
            "javascript": "class Solution {\n    fib(n) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-16-9-2-count-square-submatrices-': {
        'name': 'Count Square Submatrices with All Ones',
        'statement': '<p>Given a <code>m * n</code> matrix of ones and zeros, return how many <strong>square submatrices</strong> have all ones.</p>',
        'example1': '<p><strong>Input:</strong> matrix = [<br>&nbsp;&nbsp;[0,1,1,1],<br>&nbsp;&nbsp;[1,1,1,1],<br>&nbsp;&nbsp;[0,1,1,1]<br>]</p><p><strong>Output:</strong> 15</p><p><strong>Explanation:</strong><br>There are 10 squares of side 1.<br>There are 4 squares of side 2.<br>There is 1 square of side 3.<br>Total number of squares = 10 + 4 + 1 = 15.</p>',
        'constraints': '<ul><li>1 &le; matrix.length, matrix[0].length &le; 300</li><li>matrix[i][j] is 0 or 1.</li></ul>',
        'hints': ['dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]}) if matrix[i][j] == 1.'],
        'testcases': [{'inputs': {'matrix': '[[0,1,1,1],[1,1,1,1],[0,1,1,1]]'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public int countSquares(int[][] matrix) {\n        // Your code goes here\n        return 0;\n    }\n}\n",
            "python": "class Solution:\n    def countSquares(self, matrix: list[list[int]]) -> int:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int countSquares(vector<vector<int>>& matrix) {\n        // Your code goes here\n        return 0;\n    }\n};\n",
            "javascript": "class Solution {\n    countSquares(matrix) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-17-2-4-bit-prerequisites-for-tri': {
        'name': 'Maximum XOR of Two Numbers in an Array',
        'statement': '<p>Given an integer array <strong>nums</strong>, return <em>the maximum result of <code>nums[i] XOR nums[j]</code></em>, where <code>0 &le; i &le; j &lt; nums.length</code>.</p>',
        'example1': '<p><strong>Input:</strong> nums = [3, 10, 5, 25, 2, 8]</p><p><strong>Output:</strong> 28</p><p><strong>Explanation:</strong> The maximum result is 5 XOR 25 = 28.</p>',
        'constraints': '<ul><li>1 &le; nums.length &le; 2 * 10<sup>5</sup></li><li>0 &le; nums[i] &le; 2<sup>31</sup> - 1</li></ul>',
        'hints': ['Insert all numbers bit-by-bit (from 31 to 0) into a Trie.', 'For each number, greedily follow the opposite bit branch to maximize XOR.'],
        'testcases': [{'inputs': {'nums': '[3, 10, 5, 25, 2, 8]'}}],
        'starters': {
            "java": "import java.util.*;\n\nclass Solution {\n    public int findMaximumXOR(int[] nums) {\n        // Your code goes here\n        return 0;\n    }\n}\n",
            "python": "class Solution:\n    def findMaximumXOR(self, nums: list[int]) -> int:\n        # Your code goes here\n        pass\n",
            "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findMaximumXOR(vector<int>& nums) {\n        // Your code goes here\n        return 0;\n    }\n};\n",
            "javascript": "class Solution {\n    findMaximumXOR(nums) {\n        // Your code goes here\n        \n    }\n}\n"
        }
    },
    'prob-18-1-3-hashing-in-strings-theory': {
        'name': 'String Hashing: Polynomial Rolling Hash',
        'statement': '<p>Given a string <strong>s</strong>, calculate its <strong>polynomial rolling hash value</strong> modulo <code>10^9 + 7</code> using base <code>p = 31</code>.</p><p><br></p><p>Formula: <code>Hash = sum(s[i] * p^i) % M</code> for <code>0 &le; i &lt; s.length</code>, where <code>s[i] = charValue - \'a\' + 1</code>.</p>',
        'example1': '<p><strong>Input:</strong> s = "abc"</p><p><strong>Output:</strong> 2980</p><p><strong>Explanation:</strong> (1 * 31^0) + (2 * 31^1) + (3 * 31^2) = 1 + 62 + 2883 = 2946.</p>',
        'constraints': '<ul><li>1 &le; s.length &le; 10<sup>5</sup></li><li>s contains only lowercase English alphabets.</li></ul>',
        'hints': ['Compute power of 31 iteratively modulo 10^9 + 7 to avoid arithmetic overflow.'],
        'testcases': [{'inputs': {'s': 'abc'}}],
        'starters': {
            'java': 'class Solution {\n    public long computeHash(String s) {\n        long p = 31, m = 1000000007L, hash = 0, pPow = 1;\n        for (char c : s.toCharArray()) {\n            hash = (hash + (c - \'a\' + 1) * pPow) % m;\n            pPow = (pPow * p) % m;\n        }\n        return hash;\n    }\n}\n',
            'python': 'class Solution:\n    def computeHash(self, s: str) -> int:\n        p, m, hash_val, p_pow = 31, 10**9 + 7, 0, 1\n        for c in s:\n            hash_val = (hash_val + (ord(c) - ord(\'a\') + 1) * p_pow) % m\n            p_pow = (p_pow * p) % m\n        return hash_val\n',
            'cpp': '#include <bits/stdc++.h>\nusing namespace std;\nclass Solution {\npublic:\n    long long computeHash(string s) {\n        long long p = 31, m = 1e9 + 7, hash_val = 0, p_pow = 1;\n        for (char c : s) {\n            hash_val = (hash_val + (c - \'a\' + 1) * p_pow) % m;\n            p_pow = (p_pow * p) % m;\n        }\n        return hash_val;\n    }\n};\n',
            'javascript': 'class Solution {\n    computeHash(s) {\n        const p = 31n, m = 1000000007n;\n        let hashVal = 0n, pPow = 1n;\n        for (let i = 0; i < s.length; i++) {\n            const val = BigInt(s.charCodeAt(i) - 96);\n            hashVal = (hashVal + val * pPow) % m;\n            pPow = (pPow * p) % m;\n        }\n        return Number(hashVal);\n    }\n}\n'
        }
    }
}

# Apply hand-crafted authentic definitions
for pid, item in HAND_CRAFTED.items():
    cur = details.get(pid, {})
    cur.update(item)
    details[pid] = cur
    # Also update any slug key
    plus_slug = None
    for s in sheet['steps']:
        for sub in s['subcategories']:
            for p in sub['problems']:
                if p['id'] == pid and p.get('plus'):
                    plus_slug = p['plus'].replace('/plus/dsa/problems/', '').split('?')[0].strip('/')
    if plus_slug:
        details[plus_slug] = cur

# 3. Write back problem-details.json
with open('src/data/problem-details.json', 'w') as f:
    json.dump(details, f, indent=2)

print("Saved updated problem-details.json successfully!")
