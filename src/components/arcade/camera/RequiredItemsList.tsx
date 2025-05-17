
interface RequiredItemsListProps {
  requiredItems: string[];
  detectedObjects: Set<string>;
}

export function RequiredItemsList({ requiredItems, detectedObjects }: RequiredItemsListProps) {
  return (
    <div className="bg-muted p-4 rounded-md">
      <h3 className="font-medium mb-2">Find these items:</h3>
      <ul className="grid grid-cols-2 gap-2">
        {requiredItems.map(item => (
          <li 
            key={item}
            className={`flex items-center p-2 rounded ${
              detectedObjects.has(item) ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            <span className={`mr-2 ${
              detectedObjects.has(item) ? 'text-green-600 dark:text-green-400' : ''
            }`}>
              {detectedObjects.has(item) ? '✓' : '○'} 
            </span>
            <span className="capitalize">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
