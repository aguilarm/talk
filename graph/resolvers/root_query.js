const RootQuery = {
  assets(_, args, {loaders: {Assets}, user}) {
    if (user == null || !user.hasRoles('ADMIN')) {
      return null;
    }

    return Assets.getAll.load();
  },
  asset(_, query, {loaders: {Assets}}) {
    if (query.id) {
      return Assets.getByID.load(query.id);
    }

    return Assets.getByURL(query.url);
  },
  settings(_, args, {loaders: {Settings}}) {
    return Settings.load();
  },

  // This endpoint is used for loading moderation queues, so hide it in the
  // event that we aren't an admin.
  async comments(_, {query: {action_type, statuses, asset_id, parent_id, limit, cursor, sort, excludeIgnored}}, {user, loaders: {Comments, Actions}}) {
    let query = {statuses, asset_id, parent_id, limit, cursor, sort, excludeIgnored};

    if (user != null && user.hasRoles('ADMIN') && action_type) {
      let ids = await Actions.getByTypes({action_type, item_type: 'COMMENTS'});

      // Perform the query using the available resolver.
      return Comments.getByQuery({ids, statuses, asset_id, parent_id, limit, cursor, sort, excludeIgnored});
    }

    return Comments.getByQuery(query);
  },
  comment(_, {id}, {loaders: {Comments}}) {
    return Comments.get.load(id);
  },
  async commentCount(_, {query: {action_type, statuses, asset_id, parent_id}}, {user, loaders: {Actions, Comments}}) {
    if (user == null || !user.hasRoles('ADMIN')) {
      return null;
    }

    if (action_type) {
      let ids = await Actions.getByTypes({action_type, item_type: 'COMMENTS'});

      // Perform the query using the available resolver.
      return Comments.getCountByQuery({ids, statuses, asset_id, parent_id});
    }

    return Comments.getCountByQuery({statuses, asset_id, parent_id});
  },

  assetMetrics(_, {from, to, sort, limit = 10}, {user, loaders: {Metrics: {Assets}}}) {
    if (user == null || !user.hasRoles('ADMIN')) {
      return null;
    }

    if (sort === 'ACTIVITY') {
      return Assets.getActivity({from, to, limit});
    }

    return Assets.get({from, to, sort, limit});
  },

  commentMetrics(_, {from, to, sort, limit = 10}, {user, loaders: {Metrics: {Comments}}}) {
    if (user == null || !user.hasRoles('ADMIN')) {
      return null;
    }

    return Comments.get({from, to, sort, limit});
  },

  // This returns the current user, ensure that if we aren't logged in, we
  // return null.
  me(_, args, {user}) {
    if (user == null) {
      return null;
    }

    return user;
  },

  // this returns an arbitrary user
  user(_, {id}, {user, loaders: {Users}}) {
    if (user == null || !user.hasRoles('ADMIN')) {
      return null;
    }

    return Users.getByID.load(id);
  },

  // This endpoint is used for loading the user moderation queues (users whose username has been flagged),
  // so hide it in the event that we aren't an admin.
  async users(_, {query: {action_type, limit, cursor, sort}}, {user, loaders: {Users, Actions}}) {

    if (user == null || !user.hasRoles('ADMIN')) {
      return null;
    }

    const query = {limit, cursor, sort};

    if (action_type) {
      let ids = await Actions.getByTypes({action_type, item_type: 'USERS'});

      // Perform the query using the available resolver.
      return Users.getByQuery({ids, limit, cursor, sort}).find({status: 'PENDING'});
    }

    return Users.getByQuery(query);
  }
};

module.exports = RootQuery;
