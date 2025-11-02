package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Role holds the schema definition for the Role entity.
type Role struct {
	ent.Schema
}

// Fields of the Role.
func (Role) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").
			Unique().
			Immutable(),
		field.String("name").
			Unique().
			NotEmpty().
			Comment("learner, guardian, educator, ecm, employee, intern, admin"),
		field.String("display_name").
			Optional().
			Nillable(),
		field.String("description").
			Optional().
			Nillable(),
		field.Bool("is_active").
			Default(true),
		field.Bool("is_default").
			Default(false),
		field.Time("created_at").
			Optional().
			Nillable().
			Immutable(),
		field.Time("updated_at").
			Optional().
			Nillable(),
	}
}

// Edges of the Role.
func (Role) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("role_permissions", RolePermission.Type),
		edge.To("user_roles", UserRole.Type),
	}
}

// Annotations of the Role.
func (Role) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.QueryField(),
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
