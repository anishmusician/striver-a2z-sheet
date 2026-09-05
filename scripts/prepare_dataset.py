import json
import re
import os

source_file = '/Users/anishkumar/.gemini/antigravity/brain/9c3b9ce4-7dad-4e98-b223-db7683a4d6cd/scratch/a2z_sheet.json'
with open(source_file, 'r') as f:
    sections = json.load(f)

# Curated, authentic direct GeeksforGeeks practice problems
KNOWN_GFG = {
    "largest element": "https://www.geeksforgeeks.org/problems/largest-element-in-array4009/1",
    "second largest element": "https://www.geeksforgeeks.org/problems/second-largest3735/1",
    "linear search": "https://www.geeksforgeeks.org/problems/who-will-win-1587115621/1",
    "union of two sorted arrays": "https://www.geeksforgeeks.org/problems/union-of-two-sorted-arrays-1587115621/1",
    "find missing number": "https://www.geeksforgeeks.org/problems/missing-number4257/1",
    "longest subarray with given sum k(positives)": "https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1",
    "longest subarray with sum k": "https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1",
    "leaders in an array": "https://www.geeksforgeeks.org/problems/leaders-in-an-array-1587115621/1",
    "largest subarray with sum 0": "https://www.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1",
    "find the repeating and missing number": "https://www.geeksforgeeks.org/problems/find-missing-and-repeating2512/1",
    "count inversions": "https://www.geeksforgeeks.org/problems/inversion-of-array-1587115621/1",
    "lower bound": "https://www.geeksforgeeks.org/problems/floor-in-a-sorted-array-1587115621/1",
    "upper bound": "https://www.geeksforgeeks.org/problems/ceil-the-floor2824/1",
    "floor and ceil in sorted array": "https://www.geeksforgeeks.org/problems/ceil-the-floor2824/1",
    "count occurrences in a sorted array": "https://www.geeksforgeeks.org/problems/number-of-occurrence2259/1",
    "selection sort": "https://www.geeksforgeeks.org/problems/selection-sort/1",
    "bubble sort": "https://www.geeksforgeeks.org/problems/bubble-sort/1",
    "insertion sorting": "https://www.geeksforgeeks.org/problems/insertion-sort/1",
    "merge sorting": "https://www.geeksforgeeks.org/problems/merge-sort/1",
    "quick sorting": "https://www.geeksforgeeks.org/problems/quick-sort/1",
    "recursive bubble sort": "https://www.geeksforgeeks.org/problems/bubble-sort/1",
    "recursive insertion sort": "https://www.geeksforgeeks.org/problems/insertion-sort/1",
    "implement stack using arrays": "https://www.geeksforgeeks.org/problems/implement-stack-using-array/1",
    "implement queue using arrays": "https://www.geeksforgeeks.org/problems/implement-queue-using-array/1",
    "implement stack using linkedlist": "https://www.geeksforgeeks.org/problems/implement-stack-using-linked-list/1",
    "implement queue using linkedlist": "https://www.geeksforgeeks.org/problems/implement-queue-using-linked-list/1",
    "fractional knapsack": "https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1",
    "n meetings in one room": "https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1",
    "minimum number of platforms required for a railway": "https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1",
    "job sequencing problem": "https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1",
    "top view of bt": "https://www.geeksforgeeks.org/problems/top-view-of-binary-tree/1",
    "bottom view of bt": "https://www.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1",
    "left view of bt": "https://www.geeksforgeeks.org/problems/left-view-of-binary-tree/1",
    "frog jump": "https://www.geeksforgeeks.org/problems/geek-jump/1",
    "frog jump with k distances": "https://www.geeksforgeeks.org/problems/minimal-cost/1",
    "ninja's training": "https://www.geeksforgeeks.org/problems/geeks-training/1",
    "subset sum problem": "https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1",
    "0/1 knapsack": "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1",
    "rod cutting": "https://www.geeksforgeeks.org/problems/rod-cutting0840/1",
    "matrix chain multiplication": "https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1",
    "count number of substrings": "https://www.geeksforgeeks.org/problems/count-number-of-substrings4528/1",
    "count the number of set bits": "https://www.geeksforgeeks.org/problems/set-bits0143/1",
    "check if the i-th bit is set or not": "https://www.geeksforgeeks.org/problems/check-whether-k-th-bit-is-set-or-not-1587115620/1",
    "check if a number is odd or not": "https://www.geeksforgeeks.org/problems/odd-or-even3618/1",
    "sort a stack using recursion": "https://www.geeksforgeeks.org/problems/sort-a-stack/1",
    "reverse a stack": "https://www.geeksforgeeks.org/problems/reverse-a-stack/1"
}

def clean_difficulty(d):
    if not d:
        return "Easy"
    d = d.strip().capitalize()
    if d not in ["Easy", "Medium", "Hard"]:
        return "Medium"
    return d

def slugify(s):
    s = re.sub(r'[^a-zA-Z0-9\s-]', '', s).lower()
    return re.sub(r'[\s-]+', '-', s).strip('-')

steps_data = []
all_problems_flat = []

for s_idx, sec in enumerate(sections):
    step_num = s_idx + 1
    step_title = sec.get('category_name', f"Step {step_num}")
    subcategories = []
    
    for sub_idx, sub in enumerate(sec.get('subcategories', [])):
        sub_num = sub_idx + 1
        sub_title = sub.get('subcategory_name', f"Sub-step {sub_num}").strip()
        problems = []
        
        for p_idx, p in enumerate(sub.get('problems', [])):
            name = p.get('problem_name', '').strip()
            diff = clean_difficulty(p.get('difficulty'))
            norm_name = name.lower()
            
            # Real LeetCode link only if present and non-empty
            lc_link = p.get('leetcode')
            if lc_link and not lc_link.startswith('http'):
                lc_link = None
            
            # Real GFG link only if in KNOWN_GFG (no fake search queries!)
            gfg_link = None
            for k, v in KNOWN_GFG.items():
                if k in norm_name:
                    gfg_link = v
                    break
            
            slug = slugify(name)
            code360_link = f"https://www.naukri.com/code360/problems/{slug}"
            
            prob_id = f"prob-{step_num}-{sub_num}-{p_idx+1}-{slug[:25]}"
            
            # Real YouTube link only if present and non-empty
            yt_link = p.get('youtube')
            if yt_link and not yt_link.startswith('http'):
                yt_link = None

            # Real Article link only if present and non-empty
            art_link = p.get('article')
            if art_link and not art_link.startswith('http'):
                art_link = None

            # Real Plus link only if present and non-empty
            plus_link = p.get('plus')
            if plus_link and not plus_link.strip():
                plus_link = None

            # Real Editorial link only if present and non-empty
            ed_link = p.get('editorial')
            if ed_link and not ed_link.strip():
                ed_link = None
            
            # Starter codes
            starter_python = f'''# {name} ({diff})
# Approach & Solution in Python
def solution():
    # Write your solution here
    pass

if __name__ == "__main__":
    print("Testing {name}...")
    # Add custom test cases here
    print("Result:", solution())
'''

            starter_cpp = f'''#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// {name} ({diff})
class Solution {{
public:
    void solve() {{
        // Write your solution here
    }}
}};

int main() {{
    Solution sol;
    cout << "Testing {name}..." << endl;
    return 0;
}}
'''

            starter_java = f'''import java.util.*;

// {name} ({diff})
public class Solution {{
    public void solve() {{
        // Write your solution here
    }}

    public static void main(String[] args) {{
        Solution sol = new Solution();
        System.out.println("Testing {name}...");
    }}
}}
'''

            starter_js = f'''// {name} ({diff})
function solution() {{
    // Write your solution here
    return true;
}}

console.log("Testing {name}:", solution());
'''

            prob_obj = {
                "id": prob_id,
                "title": name,
                "stepNo": step_num,
                "stepTitle": step_title,
                "subStepNo": sub_num,
                "subStepTitle": sub_title,
                "difficulty": diff,
                "leetcode": lc_link,
                "gfg": gfg_link,
                "code360": code360_link,
                "article": art_link,
                "youtube": yt_link,
                "plus": plus_link,
                "editorial": ed_link,
                "starters": {
                    "python": starter_python,
                    "cpp": starter_cpp,
                    "java": starter_java,
                    "javascript": starter_js
                }
            }
            problems.append(prob_obj)
            all_problems_flat.append(prob_obj)
            
        subcategories.append({
            "id": f"sub-{step_num}-{sub_num}",
            "title": sub_title,
            "subStepNo": sub_num,
            "problems": problems
        })
        
    steps_data.append({
        "id": f"step-{step_num}",
        "stepNo": step_num,
        "title": step_title,
        "subcategories": subcategories,
        "totalProblems": sum(len(sub["problems"]) for sub in subcategories)
    })

os.makedirs('/Users/anishkumar/Developer/DSA/src/data', exist_ok=True)
output_path = '/Users/anishkumar/Developer/DSA/src/data/a2z-sheet.json'

output_obj = {
    "title": "Striver's A2Z DSA Sheet (Free & Unlocked Edition)",
    "description": "Learn Data Structures & Algorithms from A to Z with zero paywalls, zero credits, direct practice links, and built-in code runner.",
    "totalSteps": len(steps_data),
    "totalProblems": len(all_problems_flat),
    "steps": steps_data
}

with open(output_path, 'w') as f:
    json.dump(output_obj, f, indent=2)

print(f"Successfully generated {output_path} with {len(steps_data)} steps and {len(all_problems_flat)} total problems!")
