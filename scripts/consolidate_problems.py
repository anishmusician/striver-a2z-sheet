import json
import re

with open('src/data/a2z-sheet.json', 'r') as f:
    sheet = json.load(f)

with open('src/data/problem-details.json', 'r') as f:
    raw_details = json.load(f)

unified_db = {}

def create_fallback_detail(p):
    title = p['title']
    step_title = p['stepTitle']
    sub_title = p['subStepTitle']
    diff = p['difficulty']
    
    statement = f"""<p>You are given a problem from <strong>{step_title}</strong>: <em>{sub_title}</em>.</p>
<p>Implement the optimal solution for <strong>{title}</strong>.</p>
<p>Analyze edge cases, handle large constraints, and optimize both time and space complexity.</p>"""

    ex1 = f"""<p><strong>Input:</strong> Standard test case for {title}</p>
<p><strong>Output:</strong> Expected result satisfying problem constraints</p>
<p><strong>Explanation:</strong> Refer to the video solution and editorial article for step-by-step visual trace.</p>"""

    constraints = """<ul>
<li>1 &le; N &le; 10<sup>5</sup></li>
<li>Values are within standard 32-bit signed integer limits.</li>
<li>Expected Time Complexity: O(N) or O(N log N)</li>
<li>Expected Auxiliary Space: O(1) or O(N)</li>
</ul>"""

    plus_val = p.get('plus') or ''
    slug = plus_val.replace('/plus/dsa/problems/', '').split('?')[0].strip('/') or p['id']

    return {
        'slug': slug,
        'name': title,
        'statement': statement,
        'example1': ex1,
        'example2': None,
        'example3': None,
        'constraints': constraints,
        'hints': [
            f"Think about the core data structure used in {sub_title}.",
            "Consider whether a two-pointer, hashing, or divide-and-conquer approach can optimize the time complexity.",
            "Watch the video solution for the intuition breakdown."
        ],
        'testcases': [
            {'inputs': {'param': 'default_test_case_1'}},
            {'inputs': {'param': 'default_test_case_2'}}
        ],
        'starters': p.get('starters', {})
    }

total_problems = 0
found_count = 0
synthesized_count = 0

for s in sheet['steps']:
    for sub in s['subcategories']:
        for p in sub['problems']:
            total_problems += 1
            pid = p['id']
            plus_val = p.get('plus') or ''
            slug = plus_val.replace('/plus/dsa/problems/', '').split('?')[0].strip('/') if plus_val else None
            
            detail = None
            if slug and slug in raw_details and raw_details[slug].get('statement'):
                detail = dict(raw_details[slug])
                found_count += 1
            elif pid in raw_details and raw_details[pid].get('statement'):
                detail = dict(raw_details[pid])
                found_count += 1
            else:
                detail = create_fallback_detail(p)
                synthesized_count += 1

            # Ensure all starter templates are present
            if not detail.get('starters') or not detail['starters'].get('python'):
                detail['starters'] = p.get('starters', {})

            # Clean and preserve metadata
            detail['id'] = pid
            detail['difficulty'] = p['difficulty']
            detail['stepNo'] = p['stepNo']
            detail['stepTitle'] = p['stepTitle']
            detail['subStepNo'] = p['subStepNo']
            detail['subStepTitle'] = p['subStepTitle']
            detail['leetcode'] = p.get('leetcode')
            detail['gfg'] = p.get('gfg')
            detail['code360'] = p.get('code360')
            detail['article'] = p.get('article')
            detail['youtube'] = p.get('youtube')

            unified_db[pid] = detail
            if slug:
                unified_db[slug] = detail

print(f"Total problems processed: {total_problems}")
print(f"Matched from TUF Plus: {found_count}")
print(f"Synthesized fallbacks: {synthesized_count}")
print(f"Total database keys (id + slug): {len(unified_db)}")

with open('src/data/problem-details.json', 'w') as f:
    json.dump(unified_db, f, indent=2)

print("Saved consolidated database to src/data/problem-details.json")
