# Join the TypeScript files
cat types/endpoints-types.ts types/pocketbase-types.ts > types/raito.ts

# Delete the import statement from the joined file using regex pattern
perl -0777 -i -pe "s/import \{.+\} from '\.\/pocketbase-types';\n+//gs" types/raito.ts

# Copy merge file to gami project
cp -f types/raito.ts ../gami/src/types/raito.ts
