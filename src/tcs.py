from collections import defaultdict

def office_rostering(n, m, friendships, k):
    # Create a dictionary to store friendships
    friends = defaultdict(list)
    for a, b in friendships:
        friends[a].append(b)
        friends[b].append(a)

    # Initialize variables
    working_today = [1] * n  # Everyone starts by working from office
    rostering_value = n      # Initial rostering value
    day = 1

    # Loop until rostering value reaches or exceeds K
    while rostering_value < k:
        working_tomorrow = [0] * n  # Prepare next day's attendance

        # Calculate next day's attendance
        for emp in range(n):
            count_wfo_friends = sum(working_today[friend] for friend in friends[emp])

            if working_today[emp] == 1:  # Current employee worked from office
                if count_wfo_friends == 3:
                    working_tomorrow[emp] = 1
            else:  # Current employee worked from home
                if count_wfo_friends < 3:
                    working_tomorrow[emp] = 1

        # Update rostering value
        rostering_value += sum(working_tomorrow)

        # Move to the next day
        working_today = working_tomorrow
        day += 1

    return day

# Input
n, m = map(int, input().split())
friendships = [tuple(map(int, input().split())) for _ in range(m)]
k = int(input())

# Output the result
print(office_rostering(n, m, friendships, k))
