# Frumpbox context

Last verified: 6 August 2026

The Tyrrells Open (TTO) website and Frumpbox are separate projects. Frumpbox
has supported development and automation around TTO, but TTO must remain
directly buildable and maintainable without Frumpbox or Discord. Frumpbox is
no longer on the critical path for improving TTO.

## Current development-machine folders

These absolute paths describe James's current development machine. They are
operational context, not portable repository architecture.

```text
/home/frump/projects/tto-website/website
  Current active TTO repository

/home/frump/projects/tto-website/frumpbox-v2
  Newer Frumpbox implementation

/home/frump/projects/tto-website/frumpbox-v1-prototype
  V1 prototype/reference; final long-term status not yet decided

/home/frump/projects/tto-website/workspaces
  Generated non-Git job workspaces

/home/frump/archives/frumpbox/historical-backups
  Preserved historical working backups

/home/frump/archives/frumpbox/downloaded-releases
  Preserved packaged releases
```

Last verified: 6 August 2026

## Path dependencies

Several configurations currently depend on the active TTO repository and
workspace paths. Exact consumers must be inspected before changing a path. A
newer folder does not prove that an older folder is unused.

Moving active TTO or Frumpbox workspace folders requires a coordinated
migration. Relevant configurations, scripts, services, permissions, and
documentation must be inspected and updated together.

## Development priority

Normal TTO work should proceed directly in its repository. Future Frumpbox
integration, Discord workflows, workspace migration, and publication
automation are a separate later stream.

## Retention and cleanup

Nothing listed here is labelled obsolete or safe to delete. Prototype,
workspace, backup, and packaged-release status must be proven before any
cleanup is proposed. This document provides context, not deletion authority.

