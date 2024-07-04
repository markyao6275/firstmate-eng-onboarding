# firstmate-eng-onboarding
Onboarding Repo for Engineers at First Mate Technologies

## General

### Fixing Bugs

Please read the [Fixing Bugs](https://docs.google.com/document/d/1hRccxYhoRVatB9lL-MDT-FUs4-KJbvSt2tC99HaeQC4/edit#bookmark=id.ls83ee1gke53) section in the Eng Cheatsheet

## React / Typescript

### Don't overuse state / useEffect

Please read [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

For example:

🔴 Don't:
```
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

✅ Do:
```
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```


## Python

### Use list comprehensions and other "pythonic" syntax

🔴 Don't:
```
sample_list = [1, 2, 3]
doubled = []
for item in sample_list:
    doubled.append(item * 2)
```

✅ Do:
```
sample_list = [1, 2, 3]
doubled = [item * 2 for item in sample_list]
```


### When keying into dictionaries, use `.get` as a safer alternative

🔴 Don't:
```
sample_dict = {}
value = sample_dict["test_key"] # KeyError
```

✅ Do:
```
sample_dict = {}
value = sample_dict.get("test_key")
print(value) # None
```

## Git

### Pull Request Best Practices

In general, an effective pull request (PR) makes it easy for the reviewer to understand and approve the change. You should 

1. Always include the following in the PR description
   a. Context of the problem (if fixing bug) or requirements (if implementing a feature)
   b. Brief description of change (how you solved the bug / implemented the feature)
   c. Evidence of testing (screenshots, screen recordings, log output)
2. If you're unsure about how you implemented something, mention it in a code comment or PR comment
3. Make sure the commit history is clean (use `rebase` and `commit --amend` to keep commit history clean)
   a. Not too many commits (commits like "cleanup", "fixing tests" can often be squashed into the previous commit)
   b. Changes to address PR comments should be in their own commit, so that the reviewer can see those changes on their own (and not review the entire PR again)
4. Proofread your change before sending to the review. Check for random `console.log`s, test code, commented out code etc.

### Cleaning Commit History

Two very useful commands are `git rebase -i HEAD~2` (can change `2` to whatever is necessary) and `git commit --amend`. Please read up on those commands.

`git rebase -i HEAD~2`: Lets you modify your commit history, e.g. squashing 2 commits that can be combined into one

`git commit --amend`: Lets you add changes to the most recent commit. Very useful for minor changes like removing whitespace, deleting stray `console.log`s, fixing tests.

If you modify your commit history such that it is inconsistent with `origin`, you will have to force push via:
```
git push origin feature-branch-name -f
```


## Communication

1. Provide updates often. At the bare minimum, at the beginning + end of the day, but even better if you do so often in the middle of the day as well. Giving updates for your tech lead minimizes the likelihood that you're working on the wrong thing.
2. When writing messages, be detailed but not overly verbose. Get to the point in the first sentence and provide necessary context afterwards.

Sample:

> Hello! I'm currently encountering `ERROR [flask_migrate] Error: Can't locate revision identified by 'd9624115e638'`.
>
> Questions:
> 1. I merged the migration file for the new column (`hide_empty_events`) and pulled from `main`, why am I not seeing it in my local/sandbox? What I see is
> ```
> $ flask db history
> 00599dfa7928 -> d4e4a80d17eb (head), Add date range to user
> 1b52368768ad -> 00599dfa7928, Make phase is_active non-nullable
> e48bea17fae8 -> 1b52368768ad, Remove is_active from CalendarEvent
> 66fa53b76271 -> e48bea17fae8, Remove trial from Booking
> 1125f9cc27e3 -> 26fb2e712aaf, Add index to events table
> ```
> 2. We pair-programmed yesterday to fix the same issue. Could you help me identify why this happened again?
>
> Thank you!

