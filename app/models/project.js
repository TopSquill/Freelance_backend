'use strict';
const {
  Model,
  Op,
  QueryTypes
} = require('sequelize');


const { Tag } = require('.');
const BudgetTypes = require('../utils/constants/BudgetTypes');
const DurationTypes = require('../utils/constants/DurationTypes');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Project.belongsTo(models['User'], { as: 'postedBy', foreignKey: 'posted_by_user_id' })
      Project.hasMany(models['Proposal'], { as: 'proposals', foreignKey: 'project_id' })
      Project.hasMany(models['Job'], { as: 'jobs', foreignKey: 'project_id' })
      Project.belongsToMany(models['Category'], { through: models['ProjectCategory'], as: 'categories', });
      Project.belongsToMany(models['Tag'], { through: models['ProjectTag'], as: 'keywords', foreignKey: 'project_id' });
    }
  }
  Project.init({
    headline: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    budget: DataTypes.FLOAT,
    budgetType: {
      type: DataTypes.ENUM(BudgetTypes),
      validate: {
        isIn: {
          msg: `Budget type must one of these (${Object.values(BudgetTypes).join(
            ", ",
          )})`,
          args: [BudgetTypes]
        }
      }
    },
    budgetCurrency: {
      type: DataTypes.STRING,
      validate: {
        len: 3
      }
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    postedByUserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    duration: {
      allowNull: true,
      type: DataTypes.ENUM(DurationTypes),
      validate: {
        isIn: {
          msg: `Duration type must one of these (${Object.values(DurationTypes).join(
            ", ",
          )})`,
          args: [DurationTypes]
        }
      }
    },
  }, {
    sequelize,
    name: 'Project',
    modelName: 'Project',
    underscored: true,
    timestamps: true,
  });

  Project.beforeCreate(async (project, options) => {
    project.dataValues.budgetCurrency = project.dataValues.budgetCurrency?.toUpperCase?.()
  })

//   SELECT p.*, ARRAY_AGG(t.title) AS tags
// FROM projects p
// LEFT JOIN project_tags pt ON pt.project_id = p.id
// INNER JOIN tags t on pt.tag_id=t.id
// WHERE pt.tag_id = ANY('{1,3}'::INT[]) OR pt.tag_id IS NULL group by p.id;

  Project.getFilteredProject = async (search, tags=null, budgetType=[], budgetRange=[]) => {
    const data = await sequelize.query(`
      SELECT p.*, ARRAY_AGG(t.title) AS tags
      FROM projects p
      LEFT OUTER JOIN project_tags pt ON pt.project_id = p.id
      LEFT OUTER JOIN tags t ON t.id = pt.tag_id
      where 
        (t.title like :search OR 
        p.headline like :search OR 
        p.description like :search) AND
        (
          cardinality(ARRAY[:budget_type]::VARCHAR[]) = 0 OR
          p.budget_type::text = ANY(ARRAY[:budget_type]::VARCHAR[]) AND
          CASE
            WHEN 
              p.budget_type::text = 'HOURLY'
            THEN 
              p.budget >= :min_hourly_price AND p.budget <= :max_hourly_price
            WHEN 
              p.budget_type::text = 'MONTHLY'
            THEN
            p.budget >= :min_monthly_price AND p.budget <= :max_monthly_price  
            WHEN 
              p.budget_type::text = 'FIXED'
            THEN 
              p.budget >= :min_fixed_price AND p.budget <= :max_fixed_price
          END
        ) AND (
          :tags_filtered OR t.id IN (:tags)
        ) AND (
          p.id > :last_fetched_project_id
        ) GROUP BY p.id
        order by updated_at desc
        limit :limit
      `, {
      // HAVING ARRAY_AGG(t.title) && :tags
      replacements: {
        search: `%${search ?? ''}%`,
        tags_filtered: !tags?.length,
        tags: !!tags?.length ? tags : -1,
        budget_type: !!budgetType.length ? budgetType : [],
        min_hourly_price: budgetRange?.['HOURLY']?.[0] ?? 0,
        max_hourly_price: budgetRange?.['HOURLY']?.[1] ?? Number.MAX_SAFE_INTEGER,
        min_monthly_price: budgetRange?.['MONTHLY']?.[0] ?? 0,
        max_monthly_price: budgetRange?.['MONTHLY']?.[1] ?? Number.MAX_SAFE_INTEGER,
        min_fixed_price: budgetRange?.['FIXED']?.[0] ?? 0,
        max_fixed_price: budgetRange?.['FIXED']?.[1] ?? Number.MAX_SAFE_INTEGER,
        last_fetched_project_id: 0,
        limit: 20
      },
      type: QueryTypes.SELECT,
      model: Project,
      mapToModel: true
    })

    return data;
  };

  
  return Project;
};