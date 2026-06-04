const baseCodingProblems = [
  {
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    tags: ['Array', 'Hash Map'],
    estimatedMinutes: 15,
    acceptance: 72,
    functionName: 'twoSum',
    prompt:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume exactly one answer exists, and you may not use the same element twice.',
    inputFormat: 'nums: number[], target: number',
    outputFormat: 'number[] containing the two indices in any order',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Exactly one valid pair exists'],
    starterCode: `function twoSum(nums, target) {
  // Return the two indices whose values add up to target.
}`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1], public: true, unordered: true },
      { args: [[3, 2, 4], 6], expected: [1, 2], public: true, unordered: true },
      { args: [[3, 3], 6], expected: [0, 1], public: false, unordered: true },
      { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], public: false, unordered: true },
    ],
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stacks',
    tags: ['Stack', 'String'],
    estimatedMinutes: 12,
    acceptance: 68,
    functionName: 'isValid',
    prompt:
      'Given a string containing only brackets, determine whether every opening bracket is closed by the same type of bracket and in the correct order.',
    inputFormat: 's: string',
    outputFormat: 'boolean',
    constraints: ['1 <= s.length <= 10^4', 's contains only (), {}, and [] characters'],
    starterCode: `function isValid(s) {
  // Return true when the bracket sequence is valid.
}`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "([)]"', output: 'false' },
    ],
    tests: [
      { args: ['()'], expected: true, public: true },
      { args: ['()[]{}'], expected: true, public: true },
      { args: ['([)]'], expected: false, public: false },
      { args: ['{[]}'], expected: true, public: false },
    ],
  },
  {
    slug: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Greedy',
    tags: ['Array', 'Greedy'],
    estimatedMinutes: 18,
    acceptance: 75,
    functionName: 'maxProfit',
    prompt:
      'Given prices where prices[i] is the price of a stock on day i, choose one day to buy and one later day to sell. Return the maximum profit, or 0 if no profit is possible.',
    inputFormat: 'prices: number[]',
    outputFormat: 'number',
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    starterCode: `function maxProfit(prices) {
  // Return the best profit from one buy and one sell.
}`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5' },
      { input: 'prices = [7,6,4,3,1]', output: '0' },
    ],
    tests: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5, public: true },
      { args: [[7, 6, 4, 3, 1]], expected: 0, public: true },
      { args: [[2, 4, 1]], expected: 2, public: false },
      { args: [[1, 2, 3, 4, 5]], expected: 4, public: false },
    ],
  },
  {
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    category: 'Hashing',
    tags: ['Array', 'Hash Map', 'String'],
    estimatedMinutes: 25,
    acceptance: 61,
    functionName: 'groupAnagrams',
    prompt:
      'Given an array of strings, group the anagrams together. The answer can be returned in any order, but each group must contain words that are anagrams of one another.',
    inputFormat: 'strs: string[]',
    outputFormat: 'string[][]',
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters'],
    starterCode: `function groupAnagrams(strs) {
  // Return an array of anagram groups.
}`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]' },
    ],
    tests: [
      { args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']], public: true, unorderedGroups: true },
      { args: [['']], expected: [['']], public: true, unorderedGroups: true },
      { args: [['a']], expected: [['a']], public: false, unorderedGroups: true },
      { args: [['abc', 'bca', 'cab', 'foo', 'ofo']], expected: [['abc', 'bca', 'cab'], ['foo', 'ofo']], public: false, unorderedGroups: true },
    ],
  },
  {
    slug: 'product-of-array-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    category: 'Prefix Products',
    tags: ['Array', 'Prefix', 'Interview'],
    estimatedMinutes: 30,
    acceptance: 58,
    functionName: 'productExceptSelf',
    prompt:
      'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all elements of nums except nums[i]. Solve it without using division.',
    inputFormat: 'nums: number[]',
    outputFormat: 'number[]',
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'Do not use division'],
    starterCode: `function productExceptSelf(nums) {
  // Return product of every element except self.
}`,
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
    ],
    tests: [
      { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], public: true },
      { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0], public: true },
      { args: [[2, 3, 4, 5]], expected: [60, 40, 30, 24], public: false },
      { args: [[0, 0]], expected: [0, 0], public: false },
    ],
  },
  {
    slug: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    tags: ['String', 'Sliding Window', 'Hash Set'],
    estimatedMinutes: 28,
    acceptance: 53,
    functionName: 'lengthOfLongestSubstring',
    prompt:
      'Given a string s, find the length of the longest substring without repeating characters.',
    inputFormat: 's: string',
    outputFormat: 'number',
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols, and spaces'],
    starterCode: `function lengthOfLongestSubstring(s) {
  // Return the longest length with all unique characters.
}`,
    examples: [
      { input: 's = "abcabcbb"', output: '3' },
      { input: 's = "bbbbb"', output: '1' },
    ],
    tests: [
      { args: ['abcabcbb'], expected: 3, public: true },
      { args: ['bbbbb'], expected: 1, public: true },
      { args: ['pwwkew'], expected: 3, public: false },
      { args: [''], expected: 0, public: false },
    ],
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: 'Binary Search',
    tags: ['Array', 'Binary Search'],
    estimatedMinutes: 12,
    acceptance: 79,
    functionName: 'search',
    prompt:
      'Given a sorted array nums and a target value, return the index if the target is found. Otherwise, return -1. Your solution should run in O(log n) time.',
    inputFormat: 'nums: number[], target: number',
    outputFormat: 'number',
    constraints: ['1 <= nums.length <= 10^5', 'nums is sorted in ascending order', 'All values in nums are unique'],
    starterCode: `function search(nums, target) {
  // Return the index of target, or -1 when absent.
}`,
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
    ],
    tests: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, public: true },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, public: true },
      { args: [[5], 5], expected: 0, public: false },
      { args: [[1, 3, 5, 7, 9, 11], 1], expected: 0, public: false },
    ],
  },
  {
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Intervals',
    tags: ['Array', 'Sorting', 'Intervals'],
    estimatedMinutes: 30,
    acceptance: 57,
    functionName: 'merge',
    prompt:
      'Given an array of intervals where intervals[i] = [start, end], merge every overlapping interval and return the non-overlapping intervals sorted by start time.',
    inputFormat: 'intervals: number[][]',
    outputFormat: 'number[][]',
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start <= end <= 10^4'],
    starterCode: `function merge(intervals) {
  // Return merged, non-overlapping intervals.
}`,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
    ],
    tests: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]], public: true },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]], public: true },
      { args: [[[1, 4], [0, 2], [3, 5]]], expected: [[0, 5]], public: false },
      { args: [[[1, 4]]], expected: [[1, 4]], public: false },
    ],
  },
  {
    slug: 'kth-largest-element',
    title: 'Kth Largest Element',
    difficulty: 'Medium',
    category: 'Heap',
    tags: ['Array', 'Heap', 'Sorting'],
    estimatedMinutes: 25,
    acceptance: 64,
    functionName: 'findKthLargest',
    prompt:
      'Given an integer array nums and an integer k, return the kth largest element in the array. It is the kth largest in sorted order, not the kth distinct value.',
    inputFormat: 'nums: number[], k: number',
    outputFormat: 'number',
    constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    starterCode: `function findKthLargest(nums, k) {
  // Return the kth largest value.
}`,
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' },
    ],
    tests: [
      { args: [[3, 2, 1, 5, 6, 4], 2], expected: 5, public: true },
      { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4, public: true },
      { args: [[1], 1], expected: 1, public: false },
      { args: [[-1, 2, 0], 2], expected: 0, public: false },
    ],
  },
  {
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    tags: ['DP', 'Math'],
    estimatedMinutes: 15,
    acceptance: 71,
    functionName: 'climbStairs',
    prompt:
      'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb either 1 or 2 steps. Return the number of distinct ways to reach the top.',
    inputFormat: 'n: number',
    outputFormat: 'number',
    constraints: ['1 <= n <= 45'],
    starterCode: `function climbStairs(n) {
  // Return how many distinct ways can reach step n.
}`,
    examples: [
      { input: 'n = 2', output: '2' },
      { input: 'n = 3', output: '3' },
    ],
    tests: [
      { args: [2], expected: 2, public: true },
      { args: [3], expected: 3, public: true },
      { args: [1], expected: 1, public: false },
      { args: [10], expected: 89, public: false },
    ],
  },
  {
    slug: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['DP', 'BFS', 'Array'],
    estimatedMinutes: 35,
    acceptance: 46,
    functionName: 'coinChange',
    prompt:
      'Given coin denominations and a target amount, return the fewest number of coins needed to make that amount. Return -1 if the amount cannot be made.',
    inputFormat: 'coins: number[], amount: number',
    outputFormat: 'number',
    constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4', '1 <= coins[i] <= 2^31 - 1'],
    starterCode: `function coinChange(coins, amount) {
  // Return the minimum number of coins, or -1.
}`,
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3' },
      { input: 'coins = [2], amount = 3', output: '-1' },
    ],
    tests: [
      { args: [[1, 2, 5], 11], expected: 3, public: true },
      { args: [[2], 3], expected: -1, public: true },
      { args: [[1], 0], expected: 0, public: false },
      { args: [[2, 5, 10, 1], 27], expected: 4, public: false },
    ],
  },
  {
    slug: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    category: 'Graphs',
    tags: ['DFS', 'BFS', 'Matrix'],
    estimatedMinutes: 32,
    acceptance: 55,
    functionName: 'numIslands',
    prompt:
      'Given a 2D grid of "1" land and "0" water, count the number of islands. An island is surrounded by water and connected horizontally or vertically.',
    inputFormat: 'grid: string[][]',
    outputFormat: 'number',
    constraints: ['1 <= rows, cols <= 300', 'grid[i][j] is "0" or "1"'],
    starterCode: `function numIslands(grid) {
  // Return the number of connected land components.
}`,
    examples: [
      { input: 'grid = [["1","1","0"],["0","1","0"],["1","0","1"]]', output: '3' },
    ],
    tests: [
      { args: [[[ '1', '1', '0' ], [ '0', '1', '0' ], [ '1', '0', '1' ]]], expected: 3, public: true },
      { args: [[[ '1', '1', '1' ], [ '0', '1', '0' ], [ '1', '1', '1' ]]], expected: 1, public: true },
      { args: [[[ '0', '0' ], [ '0', '0' ]]], expected: 0, public: false },
      { args: [[[ '1' ]]], expected: 1, public: false },
    ],
  },
  {
    slug: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    category: 'Graphs',
    tags: ['Graph', 'Topological Sort', 'DFS'],
    estimatedMinutes: 35,
    acceptance: 49,
    functionName: 'canFinish',
    prompt:
      'There are numCourses courses labeled from 0 to numCourses - 1. Given prerequisite pairs [a, b], decide whether you can finish all courses.',
    inputFormat: 'numCourses: number, prerequisites: number[][]',
    outputFormat: 'boolean',
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000'],
    starterCode: `function canFinish(numCourses, prerequisites) {
  // Return false when the prerequisite graph has a cycle.
}`,
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' },
      { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false' },
    ],
    tests: [
      { args: [2, [[1, 0]]], expected: true, public: true },
      { args: [2, [[1, 0], [0, 1]]], expected: false, public: true },
      { args: [4, [[1, 0], [2, 1], [3, 2]]], expected: true, public: false },
      { args: [3, [[0, 1], [1, 2], [2, 0]]], expected: false, public: false },
    ],
  },
  {
    slug: 'binary-tree-level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    category: 'Trees',
    tags: ['Tree', 'BFS', 'Queue'],
    estimatedMinutes: 28,
    acceptance: 63,
    functionName: 'levelOrder',
    prompt:
      'Given a binary tree represented as nested objects with val, left, and right properties, return its values level by level from top to bottom.',
    inputFormat: 'root: { val: number, left?: object|null, right?: object|null } | null',
    outputFormat: 'number[][]',
    constraints: ['0 <= number of nodes <= 2000'],
    starterCode: `function levelOrder(root) {
  // Return node values grouped by tree level.
}`,
    examples: [
      { input: 'root = { val: 3, left: { val: 9 }, right: { val: 20, left: { val: 15 }, right: { val: 7 } } }', output: '[[3],[9,20],[15,7]]' },
    ],
    tests: [
      { args: [{ val: 3, left: { val: 9, left: null, right: null }, right: { val: 20, left: { val: 15, left: null, right: null }, right: { val: 7, left: null, right: null } } }], expected: [[3], [9, 20], [15, 7]], public: true },
      { args: [{ val: 1, left: null, right: null }], expected: [[1]], public: true },
      { args: [null], expected: [], public: false },
      { args: [{ val: 1, left: { val: 2, left: { val: 4, left: null, right: null }, right: null }, right: { val: 3, left: null, right: null } }], expected: [[1], [2, 3], [4]], public: false },
    ],
  },
  {
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked List',
    tags: ['Linked List', 'Pointers'],
    estimatedMinutes: 18,
    acceptance: 76,
    functionName: 'reverseList',
    prompt:
      'Given a linked list represented as an array of node values, return the values of the linked list after reversing it. This mirrors the pointer problem while keeping the practice runner simple.',
    inputFormat: 'head: number[]',
    outputFormat: 'number[]',
    constraints: ['0 <= head.length <= 5000', '-5000 <= node value <= 5000'],
    starterCode: `function reverseList(head) {
  // Return the values in reversed linked-list order.
}`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
    ],
    tests: [
      { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1], public: true },
      { args: [[1, 2]], expected: [2, 1], public: true },
      { args: [[]], expected: [], public: false },
      { args: [[9]], expected: [9], public: false },
    ],
  },
  {
    slug: 'implement-queue-using-stacks',
    title: 'Implement Queue Using Stacks',
    difficulty: 'Easy',
    category: 'Queues',
    tags: ['Queue', 'Stack', 'Design'],
    estimatedMinutes: 22,
    acceptance: 67,
    functionName: 'runQueueOperations',
    prompt:
      'Simulate a FIFO queue using only stack-style operations internally. Given operations, return the results produced by peek, pop, and empty calls.',
    inputFormat: 'operations: string[], values: number[]',
    outputFormat: '(number|boolean)[]',
    constraints: ['operations contains push, pop, peek, and empty', 'push consumes the next value from values'],
    starterCode: `function runQueueOperations(operations, values) {
  // Return outputs for pop, peek, and empty operations.
}`,
    examples: [
      { input: 'operations = ["push","push","peek","pop","empty"], values = [1,2]', output: '[1,1,false]' },
    ],
    tests: [
      { args: [['push', 'push', 'peek', 'pop', 'empty'], [1, 2]], expected: [1, 1, false], public: true },
      { args: [['empty', 'push', 'empty', 'pop', 'empty'], [7]], expected: [true, false, 7, true], public: true },
      { args: [['push', 'push', 'pop', 'peek', 'pop', 'empty'], [4, 5]], expected: [4, 5, 5, true], public: false },
      { args: [['push', 'peek', 'peek', 'pop'], [10]], expected: [10, 10, 10], public: false },
    ],
  },
  {
    slug: 'subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    category: 'Backtracking',
    tags: ['Backtracking', 'Array', 'Recursion'],
    estimatedMinutes: 26,
    acceptance: 74,
    functionName: 'subsets',
    prompt:
      'Given an integer array nums of unique elements, return all possible subsets. The solution set must not contain duplicate subsets.',
    inputFormat: 'nums: number[]',
    outputFormat: 'number[][]',
    constraints: ['1 <= nums.length <= 10', 'All nums values are unique'],
    starterCode: `function subsets(nums) {
  // Return every subset of nums.
}`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' },
    ],
    tests: [
      { args: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]], public: true, unorderedGroups: true },
      { args: [[0]], expected: [[], [0]], public: true, unorderedGroups: true },
      { args: [[1, 2]], expected: [[], [1], [2], [1, 2]], public: false, unorderedGroups: true },
      { args: [[4, 5, 6]], expected: [[], [4], [5], [4, 5], [6], [4, 6], [5, 6], [4, 5, 6]], public: false, unorderedGroups: true },
    ],
  },
  {
    slug: 'single-number',
    title: 'Single Number',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    tags: ['Bit', 'Array'],
    estimatedMinutes: 14,
    acceptance: 78,
    functionName: 'singleNumber',
    prompt:
      'Given a non-empty array where every element appears twice except for one, return the element that appears only once.',
    inputFormat: 'nums: number[]',
    outputFormat: 'number',
    constraints: ['1 <= nums.length <= 3 * 10^4', 'Every element appears twice except one'],
    starterCode: `function singleNumber(nums) {
  // Return the only value that appears once.
}`,
    examples: [
      { input: 'nums = [2,2,1]', output: '1' },
      { input: 'nums = [4,1,2,1,2]', output: '4' },
    ],
    tests: [
      { args: [[2, 2, 1]], expected: 1, public: true },
      { args: [[4, 1, 2, 1, 2]], expected: 4, public: true },
      { args: [[1]], expected: 1, public: false },
      { args: [[-1, -1, -7]], expected: -7, public: false },
    ],
  },
  {
    slug: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    category: 'Math',
    tags: ['Math'],
    estimatedMinutes: 12,
    acceptance: 61,
    functionName: 'isPalindrome',
    prompt:
      'Given an integer x, return true if x reads the same forward and backward. Negative numbers are not palindromes.',
    inputFormat: 'x: number',
    outputFormat: 'boolean',
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    starterCode: `function isPalindrome(x) {
  // Return true when x reads the same backward.
}`,
    examples: [
      { input: 'x = 121', output: 'true' },
      { input: 'x = -121', output: 'false' },
    ],
    tests: [
      { args: [121], expected: true, public: true },
      { args: [-121], expected: false, public: true },
      { args: [10], expected: false, public: false },
      { args: [0], expected: true, public: false },
    ],
  },
  {
    slug: 'sort-colors',
    title: 'Sort Colors',
    difficulty: 'Medium',
    category: 'Sorting',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    estimatedMinutes: 24,
    acceptance: 66,
    functionName: 'sortColors',
    prompt:
      'Given an array nums with values 0, 1, and 2 representing colors, return the array sorted in-place order: all 0s, then 1s, then 2s.',
    inputFormat: 'nums: number[]',
    outputFormat: 'number[]',
    constraints: ['1 <= nums.length <= 300', 'nums[i] is 0, 1, or 2'],
    starterCode: `function sortColors(nums) {
  // Return nums sorted as 0s, then 1s, then 2s.
}`,
    examples: [
      { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]' },
    ],
    tests: [
      { args: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2], public: true },
      { args: [[2, 0, 1]], expected: [0, 1, 2], public: true },
      { args: [[0]], expected: [0], public: false },
      { args: [[1, 2, 0, 1, 2, 0, 1]], expected: [0, 0, 1, 1, 1, 2, 2], public: false },
    ],
  },
  {
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    category: 'Two Pointers',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    estimatedMinutes: 25,
    acceptance: 59,
    functionName: 'maxArea',
    prompt:
      'Given heights of vertical lines, choose two lines that together with the x-axis contain the most water. Return the maximum area.',
    inputFormat: 'height: number[]',
    outputFormat: 'number',
    constraints: ['2 <= height.length <= 10^5', '0 <= height[i] <= 10^4'],
    starterCode: `function maxArea(height) {
  // Return the largest water container area.
}`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
    ],
    tests: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, public: true },
      { args: [[1, 1]], expected: 1, public: true },
      { args: [[4, 3, 2, 1, 4]], expected: 16, public: false },
      { args: [[1, 2, 1]], expected: 2, public: false },
    ],
  },
  {
    slug: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    category: 'Strings',
    tags: ['String', 'Hash Map', 'Sorting'],
    estimatedMinutes: 12,
    acceptance: 74,
    functionName: 'isAnagram',
    prompt:
      'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram uses the same characters with the same counts.',
    inputFormat: 's: string, t: string',
    outputFormat: 'boolean',
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters'],
    starterCode: `function isAnagram(s, t) {
  // Return true when both strings contain the same letters.
}`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' },
    ],
    tests: [
      { args: ['anagram', 'nagaram'], expected: true, public: true },
      { args: ['rat', 'car'], expected: false, public: true },
      { args: ['aacc', 'ccac'], expected: false, public: false },
      { args: ['listen', 'silent'], expected: true, public: false },
    ],
  },
  {
    slug: 'rotate-array',
    title: 'Rotate Array',
    difficulty: 'Medium',
    category: 'Arrays',
    tags: ['Array', 'Two Pointers'],
    estimatedMinutes: 22,
    acceptance: 54,
    functionName: 'rotate',
    prompt:
      'Given an array nums, rotate the array to the right by k steps and return the rotated array.',
    inputFormat: 'nums: number[], k: number',
    outputFormat: 'number[]',
    constraints: ['1 <= nums.length <= 10^5', '0 <= k <= 10^5'],
    starterCode: `function rotate(nums, k) {
  // Return nums rotated right by k positions.
}`,
    examples: [
      { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]' },
    ],
    tests: [
      { args: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [5, 6, 7, 1, 2, 3, 4], public: true },
      { args: [[-1, -100, 3, 99], 2], expected: [3, 99, -1, -100], public: true },
      { args: [[1, 2], 3], expected: [2, 1], public: false },
      { args: [[1, 2, 3], 0], expected: [1, 2, 3], public: false },
    ],
  },
  {
    slug: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    category: 'Binary Search',
    tags: ['Array', 'Binary Search'],
    estimatedMinutes: 32,
    acceptance: 43,
    functionName: 'searchRotated',
    prompt:
      'Given a sorted array that has been rotated at an unknown pivot and a target, return the target index or -1. Values are unique and the solution should be O(log n).',
    inputFormat: 'nums: number[], target: number',
    outputFormat: 'number',
    constraints: ['1 <= nums.length <= 5000', 'All nums values are unique'],
    starterCode: `function searchRotated(nums, target) {
  // Return target index in a rotated sorted array.
}`,
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' },
    ],
    tests: [
      { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4, public: true },
      { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1, public: true },
      { args: [[1], 0], expected: -1, public: false },
      { args: [[5, 1, 3], 3], expected: 2, public: false },
    ],
  },
  {
    slug: 'word-break',
    title: 'Word Break',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['DP', 'String', 'Hash Set'],
    estimatedMinutes: 35,
    acceptance: 48,
    functionName: 'wordBreak',
    prompt:
      'Given a string s and a dictionary of words, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
    inputFormat: 's: string, wordDict: string[]',
    outputFormat: 'boolean',
    constraints: ['1 <= s.length <= 300', '1 <= wordDict.length <= 1000'],
    starterCode: `function wordBreak(s, wordDict) {
  // Return true when s can be segmented using dictionary words.
}`,
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true' },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: 'false' },
    ],
    tests: [
      { args: ['leetcode', ['leet', 'code']], expected: true, public: true },
      { args: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expected: false, public: true },
      { args: ['applepenapple', ['apple', 'pen']], expected: true, public: false },
      { args: ['aaaaaaa', ['aaaa', 'aaa']], expected: true, public: false },
    ],
  },
  {
    slug: 'min-stack',
    title: 'Min Stack',
    difficulty: 'Medium',
    category: 'Stacks',
    tags: ['Stack', 'Design'],
    estimatedMinutes: 28,
    acceptance: 55,
    functionName: 'runMinStackOperations',
    prompt:
      'Design a stack that supports push, pop, top, and getMin. Given operation names and values, return outputs for top and getMin operations.',
    inputFormat: 'operations: string[], values: number[]',
    outputFormat: 'number[]',
    constraints: ['operations contains push, pop, top, getMin', 'push consumes the next value from values'],
    starterCode: `function runMinStackOperations(operations, values) {
  // Return outputs for top and getMin operations.
}`,
    examples: [
      { input: 'operations = ["push","push","push","getMin","pop","top","getMin"], values = [-2,0,-3]', output: '[-3,0,-2]' },
    ],
    tests: [
      { args: [['push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'], [-2, 0, -3]], expected: [-3, 0, -2], public: true },
      { args: [['push', 'push', 'getMin', 'top'], [1, 2]], expected: [1, 2], public: true },
      { args: [['push', 'push', 'push', 'pop', 'getMin'], [2, 0, 3]], expected: [0], public: false },
      { args: [['push', 'push', 'getMin', 'pop', 'getMin'], [5, 4]], expected: [4, 5], public: false },
    ],
  },
  {
    slug: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    category: 'Strings',
    tags: ['String', 'Two Pointers', 'DP'],
    estimatedMinutes: 35,
    acceptance: 42,
    functionName: 'longestPalindrome',
    prompt:
      'Given a string s, return the longest palindromic substring. If multiple answers have the same length, return any one of them.',
    inputFormat: 's: string',
    outputFormat: 'string',
    constraints: ['1 <= s.length <= 1000'],
    starterCode: `function longestPalindrome(s) {
  // Return the longest palindromic substring.
}`,
    examples: [
      { input: 's = "babad"', output: '"bab" or "aba"' },
      { input: 's = "cbbd"', output: '"bb"' },
    ],
    tests: [
      { args: ['babad'], expected: ['bab', 'aba'], public: true, oneOf: true },
      { args: ['cbbd'], expected: ['bb'], public: true, oneOf: true },
      { args: ['a'], expected: ['a'], public: false, oneOf: true },
      { args: ['forgeeksskeegfor'], expected: ['geeksskeeg'], public: false, oneOf: true },
    ],
  },
  {
    slug: 'house-robber',
    title: 'House Robber',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['DP', 'Array'],
    estimatedMinutes: 24,
    acceptance: 52,
    functionName: 'rob',
    prompt:
      'Given an array where nums[i] is the money in the ith house, return the maximum amount you can rob without robbing two adjacent houses.',
    inputFormat: 'nums: number[]',
    outputFormat: 'number',
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
    starterCode: `function rob(nums) {
  // Return maximum non-adjacent sum.
}`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: '4' },
      { input: 'nums = [2,7,9,3,1]', output: '12' },
    ],
    tests: [
      { args: [[1, 2, 3, 1]], expected: 4, public: true },
      { args: [[2, 7, 9, 3, 1]], expected: 12, public: true },
      { args: [[2, 1, 1, 2]], expected: 4, public: false },
      { args: [[0]], expected: 0, public: false },
    ],
  },
  {
    slug: 'diameter-of-binary-tree',
    title: 'Diameter of Binary Tree',
    difficulty: 'Easy',
    category: 'Trees',
    tags: ['Tree', 'DFS'],
    estimatedMinutes: 25,
    acceptance: 61,
    functionName: 'diameterOfBinaryTree',
    prompt:
      'Given a binary tree represented as nested objects with val, left, and right properties, return the length in edges of the longest path between any two nodes.',
    inputFormat: 'root: tree node object | null',
    outputFormat: 'number',
    constraints: ['0 <= number of nodes <= 10^4'],
    starterCode: `function diameterOfBinaryTree(root) {
  // Return the tree diameter measured in edges.
}`,
    examples: [
      { input: 'root = { val: 1, left: { val: 2, left: { val: 4 }, right: { val: 5 } }, right: { val: 3 } }', output: '3' },
    ],
    tests: [
      { args: [{ val: 1, left: { val: 2, left: { val: 4, left: null, right: null }, right: { val: 5, left: null, right: null } }, right: { val: 3, left: null, right: null } }], expected: 3, public: true },
      { args: [{ val: 1, left: { val: 2, left: null, right: null }, right: null }], expected: 1, public: true },
      { args: [null], expected: 0, public: false },
      { args: [{ val: 1, left: { val: 2, left: { val: 3, left: { val: 4, left: null, right: null }, right: null }, right: null }, right: null }], expected: 3, public: false },
    ],
  },
  {
    slug: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    category: 'Heap',
    tags: ['Hash Map', 'Heap', 'Bucket Sort'],
    estimatedMinutes: 30,
    acceptance: 64,
    functionName: 'topKFrequent',
    prompt:
      'Given an integer array nums and an integer k, return the k most frequent elements. The answer may be returned in any order.',
    inputFormat: 'nums: number[], k: number',
    outputFormat: 'number[]',
    constraints: ['1 <= nums.length <= 10^5', 'k is in range [1, number of unique values]'],
    starterCode: `function topKFrequent(nums, k) {
  // Return the k values that appear most often.
}`,
    examples: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' },
    ],
    tests: [
      { args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], public: true, unordered: true },
      { args: [[1], 1], expected: [1], public: true, unordered: true },
      { args: [[4, 4, 4, 6, 6, 7], 1], expected: [4], public: false, unordered: true },
      { args: [[5, 3, 5, 2, 3, 3, 2, 2], 2], expected: [2, 3], public: false, unordered: true },
    ],
  },
];

const solutionBank = {
  'two-sum': {
    approach: 'Store each seen value with its index. For every number, check whether target - number has already appeared.',
    complexity: 'Time O(n), Space O(n)',
    code: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
  },
  'valid-parentheses': {
    approach: 'Use a stack for opening brackets. Each closing bracket must match the most recent opening bracket.',
    complexity: 'Time O(n), Space O(n)',
    code: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return stack.length === 0;
}`,
  },
  'best-time-to-buy-and-sell-stock': {
    approach: 'Track the cheapest price seen so far and update the best sell profit at each day.',
    complexity: 'Time O(n), Space O(1)',
    code: `function maxProfit(prices) {
  let minPrice = Infinity;
  let best = 0;
  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    best = Math.max(best, price - minPrice);
  }
  return best;
}`,
  },
  'group-anagrams': {
    approach: 'Use the sorted letters as a key. Words with the same sorted key are anagrams.',
    complexity: 'Time O(n * k log k), Space O(nk)',
    code: `function groupAnagrams(strs) {
  const groups = new Map();
  for (const word of strs) {
    const key = word.split('').sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return [...groups.values()];
}`,
  },
  'product-of-array-except-self': {
    approach: 'Build prefix products from the left, then multiply by suffix products from the right.',
    complexity: 'Time O(n), Space O(1) extra excluding answer',
    code: `function productExceptSelf(nums) {
  const ans = Array(nums.length).fill(1);
  let prefix = 1;
  for (let i = 0; i < nums.length; i += 1) {
    ans[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = nums.length - 1; i >= 0; i -= 1) {
    ans[i] *= suffix;
    suffix *= nums[i];
  }
  return ans;
}`,
  },
  'longest-substring-without-repeating-characters': {
    approach: 'Maintain a sliding window with last seen indices, moving the left boundary past repeated characters.',
    complexity: 'Time O(n), Space O(min(n, alphabet))',
    code: `function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right += 1) {
    const ch = s[right];
    if (last.has(ch)) left = Math.max(left, last.get(ch) + 1);
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  },
  'binary-search': {
    approach: 'Keep a low and high pointer. Discard half the search space after comparing the midpoint.',
    complexity: 'Time O(log n), Space O(1)',
    code: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
  },
  'merge-intervals': {
    approach: 'Sort intervals by start. Merge into the last interval when ranges overlap.',
    complexity: 'Time O(n log n), Space O(n)',
    code: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const interval of intervals) {
    const last = merged[merged.length - 1];
    if (!last || interval[0] > last[1]) merged.push([...interval]);
    else last[1] = Math.max(last[1], interval[1]);
  }
  return merged;
}`,
  },
  'kth-largest-element': {
    approach: 'Sort descending and return the item at k - 1. A heap can optimize this, but sorting is concise and accepted for practice sizes.',
    complexity: 'Time O(n log n), Space O(1) to O(n) depending on engine sort',
    code: `function findKthLargest(nums, k) {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}`,
  },
  'climbing-stairs': {
    approach: 'The ways follow Fibonacci recurrence: ways(n) = ways(n - 1) + ways(n - 2).',
    complexity: 'Time O(n), Space O(1)',
    code: `function climbStairs(n) {
  let one = 1;
  let two = 1;
  for (let step = 2; step <= n; step += 1) {
    [one, two] = [one + two, one];
  }
  return one;
}`,
  },
  'coin-change': {
    approach: 'Use bottom-up DP where dp[x] is the fewest coins needed for amount x.',
    complexity: 'Time O(amount * coins), Space O(amount)',
    code: `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let value = 1; value <= amount; value += 1) {
    for (const coin of coins) {
      if (coin <= value) dp[value] = Math.min(dp[value], dp[value - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
  },
  'number-of-islands': {
    approach: 'Visit each land cell once with DFS/BFS, marking connected land as seen.',
    complexity: 'Time O(rows * cols), Space O(rows * cols)',
    code: `function numIslands(grid) {
  let count = 0;
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  };
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] === '1') {
        count += 1;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
  },
  'course-schedule': {
    approach: 'Use topological sorting. If every course can be removed from zero-indegree queue, no cycle exists.',
    complexity: 'Time O(V + E), Space O(V + E)',
    code: `function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const indegree = Array(numCourses).fill(0);
  for (const [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    indegree[course] += 1;
  }
  const queue = [];
  indegree.forEach((degree, course) => { if (degree === 0) queue.push(course); });
  let taken = 0;
  while (queue.length) {
    const course = queue.shift();
    taken += 1;
    for (const next of graph[course]) {
      indegree[next] -= 1;
      if (indegree[next] === 0) queue.push(next);
    }
  }
  return taken === numCourses;
}`,
  },
  'binary-tree-level-order-traversal': {
    approach: 'Use BFS queue. Process one queue length at a time to form each level.',
    complexity: 'Time O(n), Space O(n)',
    code: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const size = queue.length;
    const level = [];
    for (let i = 0; i < size; i += 1) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
  },
  'reverse-linked-list': {
    approach: 'For the array representation, reversing values demonstrates the same output as pointer reversal.',
    complexity: 'Time O(n), Space O(n)',
    code: `function reverseList(head) {
  return [...head].reverse();
}`,
  },
  'implement-queue-using-stacks': {
    approach: 'Use input and output stacks. Move input to output only when output is empty.',
    complexity: 'Amortized Time O(1) per operation, Space O(n)',
    code: `function runQueueOperations(operations, values) {
  const input = [];
  const output = [];
  const result = [];
  let valueIndex = 0;
  const shift = () => {
    if (!output.length) while (input.length) output.push(input.pop());
  };
  for (const op of operations) {
    if (op === 'push') input.push(values[valueIndex++]);
    if (op === 'pop') { shift(); result.push(output.pop()); }
    if (op === 'peek') { shift(); result.push(output[output.length - 1]); }
    if (op === 'empty') result.push(input.length === 0 && output.length === 0);
  }
  return result;
}`,
  },
  subsets: {
    approach: 'Backtrack by deciding for each value whether it is included in the current subset.',
    complexity: 'Time O(n * 2^n), Space O(n * 2^n)',
    code: `function subsets(nums) {
  const result = [];
  const path = [];
  const backtrack = (index) => {
    if (index === nums.length) {
      result.push([...path]);
      return;
    }
    backtrack(index + 1);
    path.push(nums[index]);
    backtrack(index + 1);
    path.pop();
  };
  backtrack(0);
  return result;
}`,
  },
  'single-number': {
    approach: 'XOR cancels equal values because x ^ x = 0 and x ^ 0 = x.',
    complexity: 'Time O(n), Space O(1)',
    code: `function singleNumber(nums) {
  return nums.reduce((acc, value) => acc ^ value, 0);
}`,
  },
  'palindrome-number': {
    approach: 'Compare the number with its reversed digits. Negative values cannot be palindromes.',
    complexity: 'Time O(log n), Space O(1)',
    code: `function isPalindrome(x) {
  if (x < 0) return false;
  let original = x;
  let reversed = 0;
  while (x > 0) {
    reversed = reversed * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return original === reversed;
}`,
  },
  'sort-colors': {
    approach: 'Count each color, then rebuild the output in sorted color order.',
    complexity: 'Time O(n), Space O(1)',
    code: `function sortColors(nums) {
  const count = [0, 0, 0];
  for (const value of nums) count[value] += 1;
  const result = [];
  for (let color = 0; color <= 2; color += 1) {
    while (count[color] > 0) {
      result.push(color);
      count[color] -= 1;
    }
  }
  return result;
}`,
  },
  'container-with-most-water': {
    approach: 'Use two pointers. Move the shorter wall inward because it limits the current area.',
    complexity: 'Time O(n), Space O(1)',
    code: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;
  while (left < right) {
    best = Math.max(best, Math.min(height[left], height[right]) * (right - left));
    if (height[left] < height[right]) left += 1;
    else right -= 1;
  }
  return best;
}`,
  },
  'valid-anagram': {
    approach: 'Count characters from s, subtract characters from t, and reject any missing count.',
    complexity: 'Time O(n), Space O(1) for lowercase alphabet',
    code: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const counts = new Map();
  for (const ch of s) counts.set(ch, (counts.get(ch) || 0) + 1);
  for (const ch of t) {
    if (!counts.get(ch)) return false;
    counts.set(ch, counts.get(ch) - 1);
  }
  return true;
}`,
  },
  'rotate-array': {
    approach: 'Normalize k and return the suffix followed by the prefix.',
    complexity: 'Time O(n), Space O(n)',
    code: `function rotate(nums, k) {
  const shift = k % nums.length;
  if (shift === 0) return [...nums];
  return nums.slice(-shift).concat(nums.slice(0, nums.length - shift));
}`,
  },
  'search-in-rotated-sorted-array': {
    approach: 'Binary search while detecting which half is sorted, then keep the half where target can exist.',
    complexity: 'Time O(log n), Space O(1)',
    code: `function searchRotated(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}`,
  },
  'word-break': {
    approach: 'dp[i] means s.slice(0, i) can be segmented. Check every previous split point.',
    complexity: 'Time O(n^2), Space O(n)',
    code: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const dp = Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let end = 1; end <= s.length; end += 1) {
    for (let start = 0; start < end; start += 1) {
      if (dp[start] && words.has(s.slice(start, end))) {
        dp[end] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
  },
  'min-stack': {
    approach: 'Maintain a normal stack and a min stack where each position stores the minimum so far.',
    complexity: 'Time O(n), Space O(n)',
    code: `function runMinStackOperations(operations, values) {
  const stack = [];
  const mins = [];
  const output = [];
  let valueIndex = 0;
  for (const op of operations) {
    if (op === 'push') {
      const value = values[valueIndex++];
      stack.push(value);
      mins.push(mins.length ? Math.min(value, mins[mins.length - 1]) : value);
    }
    if (op === 'pop') { stack.pop(); mins.pop(); }
    if (op === 'top') output.push(stack[stack.length - 1]);
    if (op === 'getMin') output.push(mins[mins.length - 1]);
  }
  return output;
}`,
  },
  'longest-palindromic-substring': {
    approach: 'Expand around every possible center and keep the longest palindrome found.',
    complexity: 'Time O(n^2), Space O(1)',
    code: `function longestPalindrome(s) {
  let bestStart = 0;
  let bestEnd = 0;
  const expand = (left, right) => {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left -= 1;
      right += 1;
    }
    return [left + 1, right - 1];
  };
  for (let i = 0; i < s.length; i += 1) {
    for (const [start, end] of [expand(i, i), expand(i, i + 1)]) {
      if (end - start > bestEnd - bestStart) {
        bestStart = start;
        bestEnd = end;
      }
    }
  }
  return s.slice(bestStart, bestEnd + 1);
}`,
  },
  'house-robber': {
    approach: 'Track the best total when robbing up to the previous and previous-previous house.',
    complexity: 'Time O(n), Space O(1)',
    code: `function rob(nums) {
  let prev2 = 0;
  let prev1 = 0;
  for (const money of nums) {
    const current = Math.max(prev1, prev2 + money);
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
  },
  'diameter-of-binary-tree': {
    approach: 'DFS returns subtree height. At each node, left height + right height is a candidate diameter.',
    complexity: 'Time O(n), Space O(h)',
    code: `function diameterOfBinaryTree(root) {
  let best = 0;
  const height = (node) => {
    if (!node) return 0;
    const left = height(node.left);
    const right = height(node.right);
    best = Math.max(best, left + right);
    return Math.max(left, right) + 1;
  };
  height(root);
  return best;
}`,
  },
  'top-k-frequent-elements': {
    approach: 'Count frequencies, sort unique values by frequency, and return the top k values.',
    complexity: 'Time O(n log n), Space O(n)',
    code: `function topKFrequent(nums, k) {
  const counts = new Map();
  for (const value of nums) counts.set(value, (counts.get(value) || 0) + 1);
  return [...counts.keys()]
    .sort((a, b) => counts.get(b) - counts.get(a))
    .slice(0, k);
}`,
  },
};

export const codingProblems = baseCodingProblems.map((problem) => ({
  ...problem,
  solution: solutionBank[problem.slug],
}));

export function getProblemBySlug(slug) {
  return codingProblems.find((problem) => problem.slug === slug);
}

export function toProblemSummary(problem) {
  const { tests, starterCode, examples, constraints, prompt, inputFormat, outputFormat, ...summary } = problem;
  return {
    ...summary,
    publicTestCount: tests.filter((test) => test.public).length,
    hiddenTestCount: tests.filter((test) => !test.public).length,
  };
}

export function toProblemDetail(problem) {
  return {
    ...problem,
    tests: problem.tests.filter((test) => test.public),
    totalTestCount: problem.tests.length,
  };
}
