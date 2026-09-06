import json

with open('src/data/a2z-sheet.json', 'r') as f:
    sheet = json.load(f)

with open('src/data/problem-details.json', 'r') as f:
    details = json.load(f)

PLUS_UPDATES = {
    'prob-1-1-2-cpp-basics': '/plus/dsa/problems/data-types',
    'prob-1-1-5-what-are-arrays-strings': '/plus/dsa/problems/sum-of-first-last-element-in-array',
    'prob-1-6-1-understand-recursion-by-p': '/plus/dsa/problems/print-1-to-n-using-recursion',
    'prob-1-6-2-print-name-n-times-using-': '/plus/dsa/problems/print-name-n-times-using-recursion',
    'prob-5-2-5-count-number-of-substring': '/plus/dsa/problems/count-number-of-substrings',
    'prob-7-2-4-learn-all-patterns-of-sub': '/plus/dsa/problems/subsequences-power-set',
    'prob-8-1-6-setunset-the-rightmost-un': '/plus/dsa/problems/set-the-rightmost-unset-bit',
    'prob-11-2-3-sort-k-sorted-array': '/plus/dsa/problems/sort-k-sorted-array',
    'prob-14-1-3-find-minmax-in-bst': '/plus/dsa/problems/find-minmax-in-bst',
    'prob-16-9-2-count-square-submatrices-': '/plus/dsa/problems/count-square-submatrices-with-all-ones',
    'prob-17-2-4-bit-prerequisites-for-tri': '/plus/dsa/problems/maximum-xor-trie',
    'prob-18-1-3-hashing-in-strings-theory': '/plus/dsa/problems/polynomial-rolling-hash',
    'prob-18-1-5-z-function': '/plus/dsa/problems/z-function',
    'prob-18-1-7-shortest-palindrome': '/plus/dsa/problems/shortest-palindrome',
}

# Update a2z-sheet.json
for s in sheet['steps']:
    for sub in s['subcategories']:
        for p in sub['problems']:
            if p['id'] in PLUS_UPDATES:
                p['plus'] = PLUS_UPDATES[p['id']]
                # Ensure alias in details
                clean_slug = p['plus'].replace('/plus/dsa/problems/', '').strip('/')
                if p['id'] in details:
                    details[clean_slug] = details[p['id']]

with open('src/data/a2z-sheet.json', 'w') as f:
    json.dump(sheet, f, indent=2)

with open('src/data/problem-details.json', 'w') as f:
    json.dump(details, f, indent=2)

print("Updated all plus links in a2z-sheet.json and aliases in problem-details.json!")
