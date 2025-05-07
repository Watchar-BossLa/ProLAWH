
/**
 * Extract initials from a name
 * @param name Full name
 * @param limit Optional limit on number of characters
 * @returns Uppercase initials
 */
export function getInitials(name: string, limit = 2): string {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, limit);
}

/**
 * Get a color from a string (e.g., for consistent avatar colors)
 * @param str String to generate color from
 * @returns Hex color code
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).slice(-2);
  }
  
  return color;
}
