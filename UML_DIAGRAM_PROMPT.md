# UML DATABASE DIAGRAM PROMPT
## Virtual 3D Interior Design Platform - Entity Relationship Diagram

Create a comprehensive UML Entity Relationship Diagram (ERD) for a Virtual 3D Interior Design Platform database with the following entities, attributes, and relationships:

---

## ENTITIES (TABLES) AND THEIR ATTRIBUTES:

### 1. USER
**Primary Key:** _id (ObjectId)
**Attributes:**
- firstName (String, required, max 50)
- lastName (String, required, max 50)
- email (String, required, unique, indexed)
- password (String, required, hashed with bcrypt)
- avatar (String, optional)
- subscription.plan (Enum: 'free', 'pro', 'enterprise')
- subscription.status (Enum: 'active', 'inactive', 'cancelled', 'past_due')
- subscription.currentPeriodEnd (Date)
- subscription.stripeCustomerId (String)
- subscription.stripeSubscriptionId (String)
- preferences.theme (Enum: 'light', 'dark')
- preferences.units (Enum: 'metric', 'imperial')
- preferences.notifications (Object)
- isEmailVerified (Boolean)
- emailVerificationToken (String)
- passwordResetToken (String)
- passwordResetExpires (Date)
- lastLogin (Date)
- isActive (Boolean)
- createdAt (Date, timestamp)
- updatedAt (Date, timestamp)

---

### 2. DESIGNFILE
**Primary Key:** _id (ObjectId)
**Foreign Keys:**
- user (ObjectId, required) → References USER._id
**Attributes:**
- name (String, required, max 100)
- description (String, optional, max 300)
- sceneData (Object, required) - Contains 3D scene JSON data
- createdAt (Date, timestamp)
- updatedAt (Date, timestamp)

---

### 3. FURNITURE
**Primary Key:** _id (ObjectId)
**Attributes:**
- name (String, required, max 100)
- description (String, optional, max 500)
- category (Enum: 'Seating', 'Tables', 'Storage', 'Lighting', 'Bedroom', 'Decorative', 'Kitchen', 'Bathroom', 'Outdoor')
- subcategory (String, optional, max 50)
- type (String, required)
- brand (String, optional, max 50)
- model (String, optional, max 50)
- price (Number, required, min 0)
- currency (Enum: 'USD', 'EUR', 'GBP', 'CAD', 'AUD')
- dimensions.width (Number, required)
- dimensions.height (Number, required)
- dimensions.depth (Number, required)
- dimensions.unit (Enum: 'cm', 'm', 'in', 'ft')
- weight.value (Number, optional)
- weight.unit (Enum: 'kg', 'lb')
- materials (Array of Strings)
- colors (Array of Objects: name, hex, isDefault)
- images (Array of Objects: url, alt, isPrimary, order)
- model3D.url (String, optional)
- model3D.format (Enum: 'gltf', 'glb', 'obj', 'fbx')
- model3D.fileSize (Number, optional)
- specifications (Map)
- features (Array of Strings)
- tags (Array of Strings)
- availability.inStock (Boolean)
- availability.quantity (Number)
- availability.leadTime (Number)
- pricing.retail (Number, required)
- pricing.wholesale (Number, optional)
- pricing.sale (Number, optional)
- pricing.saleStart (Date, optional)
- pricing.saleEnd (Date, optional)
- ratings.average (Number, 0-5)
- ratings.count (Number)
- isActive (Boolean)
- isFeatured (Boolean)
- isPremium (Boolean)
- popularity (Number)
- seo.title (String, max 60)
- seo.description (String, max 160)
- seo.keywords (Array of Strings)
- createdAt (Date, timestamp)
- updatedAt (Date, timestamp)

---

### 4. TEMPLATE
**Primary Key:** _id (ObjectId)
**Foreign Keys:**
- design (ObjectId, required) → References DESIGN._id
- author (ObjectId, optional) → References USER._id
**Attributes:**
- name (String, required, max 100)
- description (String, required, max 500)
- category (Enum: 'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'outdoor', 'commercial', 'studio', 'dining')
- subcategory (String, optional, max 50)
- difficulty (Enum: 'beginner', 'intermediate', 'advanced')
- estimatedTime (Number, in minutes)
- roomSize.width (Number, required)
- roomSize.height (Number, required)
- roomSize.depth (Number, required)
- roomSize.unit (Enum: 'cm', 'm', 'in', 'ft')
- thumbnail (String, required)
- images (Array of Objects: url, alt, isPrimary, order)
- tags (Array of Strings)
- style (Enum: 'modern', 'traditional', 'contemporary', 'minimalist', 'industrial', 'scandinavian', 'bohemian', 'rustic', 'mid-century', 'art-deco')
- colorScheme.primary (String, hex color)
- colorScheme.secondary (String, hex color)
- colorScheme.accent (String, hex color)
- furniture (Array of Objects):
  - furnitureId (ObjectId, required) → References FURNITURE._id
  - position (Object: x, y, z)
  - rotation (Object: x, y, z)
  - scale (Object: x, y, z)
  - color (String)
- walls (Array of Objects: id, type, color, points, completed, thickness, height)
- windows (Array of Objects: id, wallId, segmentIndex, t, width, height, sill, color)
- metadata.totalArea (Number, required)
- metadata.totalCost (Number)
- metadata.furnitureCount (Number)
- metadata.wallCount (Number)
- metadata.windowCount (Number)
- requirements.subscription (Enum: 'free', 'pro', 'enterprise')
- requirements.features (Array of Strings)
- isActive (Boolean)
- isFeatured (Boolean)
- isPremium (Boolean)
- popularity (Number)
- usageCount (Number)
- ratings.average (Number, 0-5)
- ratings.count (Number)
- seo.title (String, max 60)
- seo.description (String, max 160)
- seo.keywords (Array of Strings)
- createdAt (Date, timestamp)
- updatedAt (Date, timestamp)

---

### 5. PROJECT
**Primary Key:** _id (ObjectId)
**Foreign Keys:**
- owner (ObjectId, required) → References USER._id
**Attributes:**
- name (String, required, max 100)
- description (String, optional, max 500)
- collaborators (Array of Objects):
  - user (ObjectId, required) → References USER._id
  - role (Enum: 'viewer', 'editor', 'admin')
  - addedAt (Date)
- settings.units (Enum: 'metric', 'imperial')
- settings.gridSize (Number)
- settings.snapToGrid (Boolean)
- settings.showMeasurements (Boolean)
- thumbnail (String, optional)
- tags (Array of Strings)
- isPublic (Boolean)
- isTemplate (Boolean)
- templateCategory (Enum: 'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'outdoor', 'commercial')
- status (Enum: 'draft', 'in_progress', 'completed', 'archived')
- lastModified (Date)
- version (Number)
- createdAt (Date, timestamp)
- updatedAt (Date, timestamp)

---

### 6. DESIGN
**Primary Key:** _id (ObjectId)
**Foreign Keys:**
- project (ObjectId, optional) → References PROJECT._id
- user (ObjectId, optional) → References USER._id
**Attributes:**
- name (String, required)
- description (String, optional)
- sceneData (Object, required) - Contains 3D scene JSON:
  - furniture (Array of Objects with furnitureId references)
  - walls (Array of wall objects)
  - windows (Array of window objects)
  - rooms (Array of room objects)
  - materials (Object)
  - lighting (Object)
  - camera (Object)
- furniture (Array of Objects):
  - furnitureId (ObjectId, required) → References FURNITURE._id
  - position (Object: x, y, z)
  - rotation (Object: x, y, z)
  - scale (Object: x, y, z)
  - color (String)
- walls (Array of Objects)
- windows (Array of Objects)
- metadata (Object)
- isActive (Boolean)
- createdAt (Date, timestamp)
- updatedAt (Date, timestamp)

---

## RELATIONSHIPS AND CARDINALITIES:

### 1. USER ↔ DESIGNFILE
**Relationship Type:** One-to-Many (1:N)
**Cardinality:** 
- USER (1) → (N) DESIGNFILE
- One User can have many DesignFiles
- Each DesignFile belongs to exactly one User
**Foreign Key:** DESIGNFILE.user → USER._id
**Relationship Name:** "owns" / "has"

---

### 2. USER ↔ PROJECT
**Relationship Type:** One-to-Many (1:N) for ownership, Many-to-Many (M:N) for collaboration
**Cardinality:**
- **Ownership:** USER (1) → (N) PROJECT
  - One User can own many Projects
  - Each Project has exactly one owner (User)
  - Foreign Key: PROJECT.owner → USER._id
- **Collaboration:** USER (M) ↔ (N) PROJECT
  - Many Users can collaborate on many Projects
  - Implemented through PROJECT.collaborators array
  - Each collaborator has a role (viewer, editor, admin)
**Relationship Names:** "owns" (ownership), "collaborates_on" (collaboration)

---

### 3. USER ↔ TEMPLATE
**Relationship Type:** One-to-Many (1:N)
**Cardinality:**
- USER (1) → (N) TEMPLATE
- One User (author) can create many Templates
- Each Template can have one author (User) or null (system template)
**Foreign Key:** TEMPLATE.author → USER._id (optional/nullable)
**Relationship Name:** "creates" / "authored_by"

---

### 4. TEMPLATE ↔ DESIGN
**Relationship Type:** Many-to-One (N:1)
**Cardinality:**
- TEMPLATE (N) → (1) DESIGN
- Many Templates can reference the same Design
- Each Template must have exactly one Design
**Foreign Key:** TEMPLATE.design → DESIGN._id
**Relationship Name:** "references" / "based_on"

---

### 5. TEMPLATE ↔ FURNITURE
**Relationship Type:** Many-to-Many (M:N)
**Cardinality:**
- TEMPLATE (M) ↔ (N) FURNITURE
- Many Templates can contain many Furniture items
- Many Furniture items can be used in many Templates
- Implemented through TEMPLATE.furniture array with furnitureId references
- Each relationship includes position, rotation, scale, and color data
**Relationship Name:** "contains" / "used_in"

---

### 6. DESIGN ↔ PROJECT
**Relationship Type:** Many-to-One (N:1)
**Cardinality:**
- DESIGN (N) → (1) PROJECT
- Many Designs can belong to one Project
- Each Design can optionally belong to one Project (nullable)
**Foreign Key:** DESIGN.project → PROJECT._id (optional/nullable)
**Relationship Name:** "belongs_to" / "has"

---

### 7. DESIGN ↔ USER
**Relationship Type:** Many-to-One (N:1)
**Cardinality:**
- DESIGN (N) → (1) USER
- Many Designs can be created by one User
- Each Design can optionally have one creator (User)
**Foreign Key:** DESIGN.user → USER._id (optional/nullable)
**Relationship Name:** "created_by" / "creates"

---

### 8. DESIGN ↔ FURNITURE
**Relationship Type:** Many-to-Many (M:N)
**Cardinality:**
- DESIGN (M) ↔ (N) FURNITURE
- Many Designs can contain many Furniture items
- Many Furniture items can be used in many Designs
- Implemented through DESIGN.furniture array with furnitureId references
- Each relationship includes position, rotation, scale, and color data
**Relationship Name:** "contains" / "used_in"

---

## DIAGRAM SPECIFICATIONS:

### Visual Requirements:
1. **Entity Boxes:**
   - Use rectangular boxes for each entity
   - Show entity name in bold at the top
   - List key attributes (at least primary key and foreign keys)
   - Use different colors for different entity types:
     - Blue: Core entities (USER, PROJECT)
     - Green: Content entities (DESIGN, TEMPLATE, FURNITURE)
     - Orange: File entities (DESIGNFILE)

2. **Relationship Lines:**
   - Use lines to connect related entities
   - Show cardinality notation at both ends:
     - **1** (one) - single line
     - **N** or **M** (many) - crow's foot or "many" notation
   - Label relationships with descriptive names
   - Use different line styles:
     - Solid line: Required relationship
     - Dashed line: Optional relationship (nullable foreign key)

3. **Cardinality Notation:**
   - Use standard UML notation:
     - **1** = exactly one
     - **0..1** = zero or one (optional)
     - **1..*** or **1..N** = one or many
     - **0..*** or **0..N** = zero or many
     - **M..N** = many to many

4. **Foreign Keys:**
   - Clearly mark foreign key attributes
   - Show which attribute references which entity
   - Use arrows or notation to indicate direction

### Diagram Layout:
- Place USER in the center or top
- Group related entities together:
  - USER, PROJECT, DESIGN (project management group)
  - TEMPLATE, DESIGN, FURNITURE (design content group)
  - DESIGNFILE, USER (file management group)
- Minimize line crossings
- Use clear spacing between entities

### Additional Notes:
- Show indexes on key fields (email, category, etc.) if possible
- Indicate required vs optional fields
- Show composite attributes (subscription, preferences, dimensions) as nested or grouped
- Include relationship participation (total/partial) if applicable

---

## EXAMPLE NOTATION:

```
USER (1) ────────< owns >──────── (N) DESIGNFILE

USER (1) ────────< owns >──────── (N) PROJECT
USER (M) ───────< collaborates_on >──── (N) PROJECT

TEMPLATE (N) ────< references >──── (1) DESIGN
TEMPLATE (M) ────< contains >─────── (N) FURNITURE

DESIGN (N) ──────< belongs_to >──── (0..1) PROJECT
DESIGN (M) ──────< contains >────── (N) FURNITURE
```

---

## TOOLS RECOMMENDED:
- Draw.io / diagrams.net
- Lucidchart
- dbdiagram.io
- MySQL Workbench
- ERDPlus
- PlantUML
- Mermaid

---

**Note:** This prompt provides complete information about all entities, their attributes, relationships, and cardinalities. Use this to create a professional UML ERD diagram that accurately represents the database schema of the Virtual 3D Interior Design Platform.



